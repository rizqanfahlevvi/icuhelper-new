import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, UserPlus, UserCheck, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';
import { useClinicalStore } from '../store/useClinicalStore';
import { formatDataAge } from '../utils/patientContext';

interface ActivePatientBriefCardProps {
  onAutofill?: (data: { weightKg: string; temp?: string; age?: string; gender?: string }) => void;
  title?: string;
}

/** Hari rawat ke-n (hari MRS = hari ke-1). */
function dayOfCare(mrsDate?: string): { day: number; label: string } | null {
  if (!mrsDate) return null;
  const mrs = new Date(mrsDate);
  if (isNaN(mrs.getTime())) return null;
  const today = new Date();
  mrs.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(Math.abs(today.getTime() - mrs.getTime()) / (1000 * 60 * 60 * 24));
  return { day: diffDays + 1, label: mrs.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) };
}

/**
 * Kartu pasien aktif versi ringkas: satu baris identitas (nama · usia · JK · BB · H-n) + status data.
 * Detail (kategori, MRS, lengkapi data, tutup pasien) disembunyikan di balik tombol buka.
 */
export function ActivePatientBriefCard({ onAutofill, title }: ActivePatientBriefCardProps) {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();
  const [open, setOpen] = useState(false);
  const [reloaded, setReloaded] = useState(false);
  const hasPatientData = !!patient.weightKg || !!patient.nama;

  const handleReload = () => {
    if (!onAutofill) return;
    onAutofill({
      weightKg: patient.weightKg || clinicalStore.data.weight || '',
      // Jangan mengarang suhu: kosong bila belum pernah diisi.
      temp: clinicalStore.data.temp || '',
      age: patient.ageYears || clinicalStore.data.age || '',
      gender: patient.gender || clinicalStore.data.gender || '',
    });
    setReloaded(true);
    window.setTimeout(() => setReloaded(false), 1800);
  };

  // Data kerja klinis ikut dikosongkan otomatis oleh store/patientContextSync.ts.
  const handleClosePatient = () => {
    setOpen(false);
    patient.setActivePatient(null);
  };

  if (!hasPatientData) {
    return (
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
        <UserPlus className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-amber-800 dark:text-amber-300 leading-tight">{title ?? 'Belum ada pasien aktif'}</p>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 leading-snug">Isian tidak terisi otomatis dari data pasien.</p>
        </div>
        <Link
          to="/patients"
          className="shrink-0 min-h-[40px] flex items-center gap-1 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold"
        >
          Pilih Pasien <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const ageLabel = patient.ageYears ? `${patient.ageYears} th` : patient.ageMonths ? `${patient.ageMonths} bln` : '';
  const genderLabel = patient.gender === 'L' ? 'L' : patient.gender === 'P' ? 'P' : '';
  const care = dayOfCare(patient.mrsDate);
  const facts = [ageLabel, genderLabel, patient.weightKg ? `${patient.weightKg} kg` : '', care ? `H-${care.day}` : ''].filter(Boolean);

  const filledCount = Object.values(clinicalStore.data).filter(v => typeof v === 'string' && v.trim() !== '').length;
  const stampValues = Object.values(clinicalStore.updatedAt).filter((t): t is number => typeof t === 'number');
  const lastUpdateAge = stampValues.length > 0 ? formatDataAge(Math.max(...stampValues)) : '';
  const shortId = patient.activePatientId ? patient.activePatientId.substring(0, 6) : '';

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15">
      {/* Baris identitas */}
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="min-w-0 flex-1 flex items-center gap-2.5 text-left min-h-[40px]"
        >
          <UserCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-extrabold text-[var(--label-primary)] truncate">
              {title ? <span className="font-semibold text-[var(--label-secondary)]">{title}: </span> : null}
              {patient.nama || 'Pasien Anonim'}
            </span>
            {facts.length > 0 && (
              <span className="block text-[12px] font-semibold text-[var(--label-secondary)] truncate">{facts.join(' · ')}</span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 shrink-0 text-[var(--label-secondary)] transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <Link
          to="/patients"
          className="shrink-0 min-h-[40px] flex items-center px-3 rounded-lg border border-emerald-500/30 bg-[var(--bg-elevated)] text-[12px] font-bold text-emerald-700 dark:text-emerald-300"
        >
          Ganti
        </Link>
      </div>

      {/* Status data pasien */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-t border-emerald-500/20 text-[12px]">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span className="min-w-0 flex-1 truncate text-[var(--label-secondary)]">
          {!patient.activePatientId
            ? 'Sesi tanpa pasien — data tidak tersimpan ke daftar pasien'
            : filledCount > 0
              ? `${filledCount} nilai terisi dari pasien${lastUpdateAge ? ` · ${lastUpdateAge}` : ''}`
              : 'Belum ada nilai klinis tersimpan untuk pasien ini'}
        </span>
        {onAutofill && (
          <button
            type="button"
            onClick={handleReload}
            title="Isi ulang isian dari data pasien"
            className="shrink-0 min-h-[32px] flex items-center gap-1 px-2 rounded-md font-bold text-[var(--accent)] hover:bg-[var(--accent-tint)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reloaded ? 'animate-spin' : ''}`} />
            {reloaded ? 'Dimuat' : 'Muat ulang'}
          </button>
        )}
      </div>

      {/* Detail (dilipat) */}
      {open && (
        <div className="px-3 pb-3 pt-2 border-t border-emerald-500/20 space-y-2 text-[12px] text-[var(--label-secondary)]">
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
            {patient.category && (<><dt>Kategori</dt><dd className="font-semibold text-[var(--label-primary)] capitalize">{patient.category}</dd></>)}
            {care && (<><dt>MRS</dt><dd className="font-semibold text-[var(--label-primary)]">{care.label} (hari ke-{care.day})</dd></>)}
            {patient.heightCm && (<><dt>Tinggi</dt><dd className="font-semibold text-[var(--label-primary)]">{patient.heightCm} cm</dd></>)}
            {shortId && (<><dt>ID</dt><dd className="font-mono text-[var(--label-primary)]">#{shortId}</dd></>)}
          </dl>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              to="/patients"
              className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <UserPlus className="w-3.5 h-3.5" /> Lengkapi Data Pasien
            </Link>
            {patient.activePatientId && (
              <button
                type="button"
                onClick={handleClosePatient}
                className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg border border-[var(--sys-red)]/30 text-[var(--sys-red)] font-bold"
              >
                <X className="w-3.5 h-3.5" /> Tutup pasien
              </button>
            )}
          </div>
          {patient.activePatientId && (
            <p className="text-[11px]">Menutup pasien mengosongkan isian; data tetap tersimpan di daftar pasien.</p>
          )}
        </div>
      )}
    </div>
  );
}
