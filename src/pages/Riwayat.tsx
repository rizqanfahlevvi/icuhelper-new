import { useState } from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { usePatientStore } from '../store/usePatientStore';
import { copyText } from '../utils/patientReport';
import { HISTORY_MODULES } from '../data/historyModules';
import { Trash2, ExternalLink, Clock, Copy, Check, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { AbbrLegend } from '../components/ui/AbbrLegend';
import { abbrInText, primaryAbbrKeys } from '../utils/abbrDetect';

export default function Riwayat() {
  const history = useHistoryStore((state) => state.entries);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const deleteEntry = useHistoryStore((state) => state.deleteEntry);
  const activePatientId = usePatientStore((s) => s.activePatientId);
  const activeName = usePatientStore((s) => s.nama);
  const [scope, setScope] = useState<'active' | 'all'>(activePatientId ? 'active' : 'all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const effectiveScope = activePatientId ? scope : 'all';
  const shown = effectiveScope === 'active' ? history.filter((e) => e.patientId === activePatientId) : history;
  const activeCount = activePatientId ? history.filter((e) => e.patientId === activePatientId).length : 0;

  const MODULE_META = HISTORY_MODULES;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Singkatan yang tertulis pada riwayat yang tampil (label modul, judul, ringkasan).
  // (maks 30 entri — murah dihitung tiap render)
  const abbrTerms = abbrInText(
    primaryAbbrKeys(),
    ...history.flatMap((e) => [MODULE_META[e.module]?.label ?? e.module, e.label, e.summary]),
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="pt-2">
        <PageHeader 
          badgeIcon={Clock}
          badgeText="RIWAYAT"
          title="Riwayat Perhitungan"
          description="Hasil kalkulator & skoring yang Anda simpan, dipisah per pasien."
          rightContent={
            history.length > 0 ? (
              <button 
                onClick={() => {
                  if(confirm('Hapus SEMUA riwayat perhitungan? Tindakan ini tidak dapat dibatalkan.')) clearHistory();
                }}
                className="min-h-[44px] flex items-center gap-2 px-3 py-1.5 text-[12px] font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Hapus Semua</span>
              </button>
            ) : null
          }
        />
      </div>

      {activePatientId && history.length > 0 && (
        <div role="tablist" aria-label="Lingkup riwayat" className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--fill-secondary)]">
          {([['active', `Pasien aktif (${activeCount})`], ['all', `Semua (${history.length})`]] as const).map(([id, text]) => (
            <button
              key={id}
              role="tab"
              aria-selected={effectiveScope === id}
              onClick={() => setScope(id)}
              className={`min-h-[44px] rounded-lg text-[13px] font-semibold truncate px-2 ${effectiveScope === id ? 'bg-[var(--bg-elevated)] text-[var(--label-primary)] shadow-sm' : 'text-[var(--label-secondary)]'}`}
            >
              {text}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {effectiveScope === 'active' && shown.length === 0 && history.length > 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--separator)] p-6 text-center text-[13px] text-muted-foreground">
            Belum ada riwayat untuk <strong>{activeName || 'pasien aktif'}</strong>. Simpan hasil dari kalkulator dengan tombol “Simpan Riwayat”.
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4 opacity-50">🗒️</span>
            <h3 className="font-semibold text-foreground">Belum ada riwayat.</h3>
            <p className="text-[13px] text-muted-foreground mt-1 max-w-sm">Ketuk “Simpan Riwayat” di bawah hasil kalkulator atau skoring — hasilnya tersimpan di sini, terkait dengan pasien aktif saat itu.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {shown.map((entry) => {
              const meta = MODULE_META[entry.module] || { label: entry.module, icon: '🧮', path: `/calculator/${entry.module}` };
              return (
                <div key={entry.id} className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col sm:flex-row gap-4 p-4 !justify-between items-start">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-2">
                       <span>{meta.icon}</span> {meta.label}
                    </div>
                    <div className="font-semibold text-foreground text-[14px] leading-tight mb-1">{entry.label}</div>
                    <div className="text-[12px] text-muted-foreground line-clamp-3">{entry.summary}</div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground mt-2">
                      <span>{formatTime(entry.timestamp)}</span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {entry.patientId ? (entry.patientName || 'Pasien') : 'Tanpa pasien'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                    <button
                      type="button"
                      onClick={async () => {
                        const ok = await copyText(`${entry.label}: ${entry.summary} (${formatTime(entry.timestamp)}${entry.patientName ? ` · ${entry.patientName}` : ''})`);
                        if (ok) { setCopiedId(entry.id); setTimeout(() => setCopiedId(null), 2000); }
                      }}
                      className="min-h-[44px] px-3 py-1.5 rounded-md bg-muted text-foreground text-[12px] font-semibold flex items-center gap-1.5 border border-border"
                    >
                      {copiedId === entry.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === entry.id ? 'Tersalin' : 'Salin'}
                    </button>
                    <Link to={meta.path} className="min-h-[44px] px-3 py-1.5 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[12px] font-semibold transition-colors flex items-center gap-1.5 border border-border">
                      <ExternalLink className="w-3.5 h-3.5" /> Buka
                    </Link>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      aria-label="Hapus entri riwayat"
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AbbrLegend terms={abbrTerms} />
    </div>
  );
}
