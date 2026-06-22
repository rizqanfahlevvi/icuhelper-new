import React from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronRight, UserPlus, Scale, Activity, Flame, Heart, CheckCircle2 } from 'lucide-react';
import { usePatientStore } from '../store/usePatientStore';
import { useClinicalStore } from '../store/useClinicalStore';

interface ActivePatientBriefCardProps {
  onAutofill?: (data: { weightKg: string; temp?: string; age?: string; gender?: string }) => void;
  title?: string;
}

export function ActivePatientBriefCard({ onAutofill, title }: ActivePatientBriefCardProps) {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();
  const hasPatientData = !!patient.weightKg || !!patient.nama;

  const handleAutofillAction = () => {
    if (onAutofill) {
      onAutofill({
        weightKg: patient.weightKg || clinicalStore.data.weight || '',
        temp: clinicalStore.data.temp || '37.0',
        age: patient.ageYears || clinicalStore.data.age || '',
        gender: patient.gender || clinicalStore.data.gender || '',
      });
    }
  };

  const handleClosePatient = () => {
    patient.setActivePatient(null);
  };

  if (!hasPatientData) {
    return (
      <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-500/30 rounded-2xl select-none relative overflow-hidden mb-5">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <UserPlus className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Belum Ada Pasien Aktif Terpilih</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                Pilih atau tambah pasien di tab <strong>Pasien</strong> untuk mengisi seluruh isian kalkulator secara otomatis (Autofill).
              </p>
            </div>
          </div>
          <Link
            to="/patients"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all shrink-0 self-end sm:self-center"
          >
            Pilih Pasien <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Format gender
  const genderLabel = patient.gender === 'L' ? 'L' : patient.gender === 'P' ? 'P' : '';
  const ageLabel = patient.ageYears 
    ? `${patient.ageYears} tahun` 
    : patient.ageMonths 
      ? `${patient.ageMonths} bulan` 
      : '';

  // Generate a short ID from activePatientId or fallback
  const shortId = patient.activePatientId ? patient.activePatientId.substring(0, 6) : 'af8242';

  // Calculate day of care
  let dayOfCareLabel = '';
  let mrsDateLabel = '';
  if (patient.mrsDate) {
    const mrsDate = new Date(patient.mrsDate);
    if (!isNaN(mrsDate.getTime())) {
      const today = new Date();
      // Reset hours to cleanly calculate day difference
      mrsDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today.getTime() - mrsDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // Standardize to Day 1 meaning same day
      dayOfCareLabel = `Hari Ke-${diffDays + 1}`;
      mrsDateLabel = mrsDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
  }

  // Count klinis & lab saved
  const activePatientData = patient.patients.find(p => p.id === patient.activePatientId);
  const clinicalVarsCount = activePatientData && activePatientData.clinicalData ? Object.keys(activePatientData.clinicalData).length : 0;

  return (
    <div className="bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 lg:p-5 relative overflow-hidden mb-5 space-y-4 shadow-sm">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
      
      {/* Top Row: Pasien Aktif & ID */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
          Pasien Aktif
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          ID: #{shortId}
        </span>
      </div>

      {/* Middle Row: Circular Icon & Name / Gender / Age */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex-shrink-0 animate-pulse">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[var(--label-primary)] flex flex-wrap items-baseline gap-1.5 min-w-0">
          <span className="font-extrabold truncate">{patient.nama || 'Pasien Anonim'}</span>
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
            / {ageLabel} {genderLabel ? `(${genderLabel})` : ''}
          </span>
        </h2>
      </div>

      {/* Bottom Row: Specs Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs relative z-10">
        {patient.category && (
          <span className="capitalize bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-1.5 shadow-xs">
            <Heart className="w-3.5 h-3.5 text-emerald-500" />
            {patient.category}
          </span>
        )}

        {patient.weightKg && (
          <span className="bg-background/45 dark:bg-black/20 border border-[var(--glass-border)] text-[var(--label-secondary)] px-3 py-1.5 rounded-xl font-bold inline-flex items-center gap-1.5 shadow-xs">
            <Scale className="w-3.5 h-3.5 text-emerald-500" />
            BB: <strong className="font-extrabold text-[var(--label-primary)]">{patient.weightKg} kg</strong>
          </span>
        )}

        {patient.mrsDate && dayOfCareLabel && (
          <span className="bg-[#f0ece1]/50 border border-amber-900/10 text-amber-900/80 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300 font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {dayOfCareLabel}
            <span className="font-medium opacity-80 ml-0.5">(MRS: {mrsDateLabel})</span>
          </span>
        )}
      </div>

      <div className="border-t border-emerald-500/20 pt-4 mt-2 relative z-10">
        <h5 className="font-bold text-emerald-800 dark:text-emerald-300 text-[13px] mb-0.5">
          Memori Klinis & Lab
        </h5>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] mb-3 font-medium">
          {clinicalVarsCount} variabel tersimpan otomatis.
        </p>

        <div className="flex flex-row items-center gap-2">
          {onAutofill ? (
            <button
              onClick={handleAutofillAction}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" /> Autofill Data
            </button>
          ) : (
            <Link
              to="/patients"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-3.5 h-3.5" /> Lengkapi Data
            </Link>
          )}

          <button
            onClick={handleClosePatient}
            className="flex items-center justify-center px-4 py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg text-xs transition-all border border-rose-200 dark:border-rose-500/20 active:scale-[0.98] whitespace-nowrap"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
