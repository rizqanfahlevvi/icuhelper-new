import { useState, useMemo } from 'react';
import AbgInterpreter from './AbgInterpreter';
import AcidBaseCorrection from './AcidBaseCorrection';
import AbgTheory from './AbgTheory';
import { AbgInputs, defaultAbgInputs } from './types';
import { Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';

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
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          🩸 ABG & Asam-Basa
          <button
            onClick={() => toggleFavorite('/abg')}
            className="p-1.5 rounded-full hover:bg-muted transition-colors opacity-90"
            title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
          >
            <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
          </button>
        </h1>
        <p className="text-muted-foreground text-[13px]">
          Interpretasi gas darah 7 langkah (asam-basa, kompensasi, anion gap, oksigenasi), serta kalkulator koreksi.
        </p>
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
