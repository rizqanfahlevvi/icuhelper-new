import { useState, useMemo } from 'react';
import AbgInterpreter from './AbgInterpreter';
import AcidBaseCorrection from './AcidBaseCorrection';
import AbgTheory from './AbgTheory';
import { AbgInputs, defaultAbgInputs } from './types';
import { Star, Droplet } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { PageHeader } from '../../components/ui/PageHeader';

export default function AbgPage() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [abgInputs, setAbgInputs] = useState<AbgInputs>(defaultAbgInputs);
  const isFav = isFavorite('/abg');

  const handleAutofill = (data: any) => {
    // Just a placeholder, as ABG inputs don't have weight/age fields directly in the AbgInputs schema
    // and AcidBaseCorrection manages weight locally inside its component right now.
  };

  const syncFields = useMemo(() => {
    return [
      { key: 'ph' as const, label: 'pH', value: abgInputs.ph, setter: (val: string) => setAbgInputs(prev => ({ ...prev, ph: val })), unit: '' },
      { key: 'pco2' as const, label: 'pCO2', value: abgInputs.pco2, setter: (val: string) => setAbgInputs(prev => ({ ...prev, pco2: val })), unit: 'mmHg' },
      { key: 'pao2' as const, label: 'PaO2', value: abgInputs.po2, setter: (val: string) => setAbgInputs(prev => ({ ...prev, po2: val })), unit: 'mmHg' },
      { key: 'hco3' as const, label: 'HCO3', value: abgInputs.hco3, setter: (val: string) => setAbgInputs(prev => ({ ...prev, hco3: val })), unit: 'mmol/L' },
      { key: 'be' as const, label: 'BE', value: abgInputs.be, setter: (val: string) => setAbgInputs(prev => ({ ...prev, be: val })), unit: 'mEq/L' },
      { key: 'na' as const, label: 'Natrium', value: abgInputs.na, setter: (val: string) => setAbgInputs(prev => ({ ...prev, na: val })), unit: 'mEq/L' },
      { key: 'cl' as const, label: 'Klorida', value: abgInputs.cl, setter: (val: string) => setAbgInputs(prev => ({ ...prev, cl: val })), unit: 'mEq/L' },
      { key: 'albumin' as const, label: 'Albumin', value: abgInputs.alb, setter: (val: string) => setAbgInputs(prev => ({ ...prev, alb: val })), unit: 'g/dL' },
      { key: 'rr' as const, label: 'RR', value: abgInputs.rr, setter: (val: string) => setAbgInputs(prev => ({ ...prev, rr: val })), unit: 'x/menit' },
      { key: 'fio2' as const, label: 'FiO2', value: abgInputs.fio2Direct, setter: (val: string) => setAbgInputs(prev => ({ ...prev, fio2Direct: val, fio2Mode: 'direct' })), unit: '%' },
    ];
  }, [abgInputs]);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="pt-2">
        <PageHeader 
          badgeIcon={Droplet}
          badgeText="GAS DARAH"
          title="ABG & Asam-Basa"
          description="Interpretasi gas darah 7 langkah (asam-basa, kompensasi, anion gap, oksigenasi), serta kalkulator koreksi."
          rightContent={
            <button
              onClick={() => toggleFavorite('/abg')}
              className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all active:scale-95 ${isFav ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
            >
              <Star className={`w-4 h-4 sm:mr-2 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Difavoritkan' : 'Favoritkan'}</span>
            </button>
          }
        />
      </div>

      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <AbgInterpreter inputs={abgInputs} setInputs={setAbgInputs} />
      <AcidBaseCorrection abgInputs={abgInputs} />
      <AbgTheory />
    </div>
  );
}
