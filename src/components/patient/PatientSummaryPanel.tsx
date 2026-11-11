import { useMemo, useState } from 'react';
import { ChevronDown, Copy, Check, ClipboardList } from 'lucide-react';
import { useClinicalStore } from '../../store/useClinicalStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import type { Patient } from '../../store/usePatientStore';
import { buildPatientReport, copyText, groupClinicalValues, latestPerModule } from '../../utils/patientReport';
import { formatDataAge } from '../../utils/patientContext';
import { historyModuleLabel } from '../../data/historyModules';

/**
 * Ringkasan pasien aktif: nilai klinis terbaru per kelompok + hasil kalkulasi terakhir
 * milik pasien ini, dengan tombol salin teks untuk catatan/aplusan.
 */
export function PatientSummaryPanel({ patient }: { patient: Patient }) {
  const data = useClinicalStore((s) => s.data);
  const updatedAt = useClinicalStore((s) => s.updatedAt);
  const entries = useHistoryStore((s) => s.entries);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null);

  const record = data as unknown as Record<string, string | undefined>;
  const stamps = updatedAt as Record<string, number | undefined>;
  const groups = useMemo(() => groupClinicalValues(record, stamps), [record, stamps]);
  const mine = useMemo(() => entries.filter((e) => e.patientId === patient.id), [entries, patient.id]);
  const calcs = useMemo(() => latestPerModule(mine), [mine]);

  const handleCopy = async () => {
    const text = buildPatientReport(patient, record, stamps, mine);
    const ok = await copyText(text);
    setCopied(ok ? 'ok' : 'fail');
    setTimeout(() => setCopied(null), 2500);
  };

  const empty = groups.length === 0 && calcs.length === 0;

  return (
    <div className="mt-4 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-1">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="min-h-[44px] flex-1 min-w-0 flex items-center gap-2 text-left"
        >
          <ClipboardList className="w-4 h-4 shrink-0 text-[var(--accent)]" />
          <span className="min-w-0">
            <span className="block text-[13px] font-bold text-[var(--label-primary)] whitespace-nowrap">Ringkasan Klinis</span>
            <span className="block text-[11px] text-[var(--label-secondary)] truncate">
              {empty ? 'Belum ada nilai atau hasil kalkulasi tersimpan' : `${groups.reduce((n, g) => n + g.items.length, 0)} nilai · ${calcs.length} hasil kalkulasi`}
            </span>
          </span>
          <ChevronDown className={`w-4 h-4 shrink-0 ml-auto text-[var(--label-secondary)] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={empty}
          className="min-h-[44px] shrink-0 flex items-center gap-1.5 px-3 rounded-lg text-[12px] font-bold text-[var(--accent)] hover:bg-[var(--accent-tint)] disabled:opacity-40"
          aria-live="polite"
          aria-label="Salin ringkasan pasien"
        >
          {copied === 'ok' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied === 'ok' ? 'Tersalin' : copied === 'fail' ? 'Gagal' : 'Salin'}
        </button>
      </div>

      {open && !empty && (
        <div className="px-3 pb-3 space-y-3 border-t border-[var(--separator)] pt-3">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--label-secondary)] mb-1">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((i) => (
                  <span key={i.key} className="inline-flex items-baseline gap-1 px-2 py-1 rounded-md bg-[var(--fill-secondary)] text-[12px] text-[var(--label-primary)]">
                    <span className="font-semibold">{i.label}</span> {i.value}
                    {i.age && <span className="text-[11px] text-[var(--label-secondary)]">· {i.age}</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {calcs.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--label-secondary)] mb-1">Hasil Kalkulasi Terakhir</p>
              <ul className="space-y-1">
                {calcs.map((c) => (
                  <li key={c.id} className="text-[12px] text-[var(--label-primary)]">
                    <span className="font-semibold">{historyModuleLabel(c.module)}:</span> {c.summary}
                    <span className="text-[11px] text-[var(--label-secondary)]"> · {formatDataAge(c.timestamp)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-[11px] text-[var(--label-secondary)]">Disalin sebagai teks untuk catatan/aplusan — verifikasi dengan rekam medis.</p>
        </div>
      )}
    </div>
  );
}
