import { useState, useEffect, useMemo } from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ClinicalReport } from '../../components/ui/ClinicalReport';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { CalcSteps } from '../../components/ui/CalcSteps';
import { InputWarning } from '../../components/ui/InputWarning';
import { rangeWarning } from '../../utils/validation';
import { Accordion } from '../../components/ui/Accordion';

export default function KalkulatorAnionGap() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  const [na, setNa] = useState<string>('');
  const [cl, setCl] = useState<string>('');
  const [hco3, setHco3] = useState<string>('');
  const [albumin, setAlbumin] = useState<string>('');

  // Auto-load clinical data on mount
  useEffect(() => {
    if (clinicalStore.data.na) setNa(clinicalStore.data.na);
    if (clinicalStore.data.cl) setCl(clinicalStore.data.cl);
    if (clinicalStore.data.hco3) setHco3(clinicalStore.data.hco3);
    if (clinicalStore.data.albumin) setAlbumin(clinicalStore.data.albumin);
  }, []);

  const syncFields = useMemo(() => [
    { key: 'na' as const, label: 'Natrium', value: na, setter: setNa, unit: 'mEq/L' },
    { key: 'cl' as const, label: 'Klorida', value: cl, setter: setCl, unit: 'mEq/L' },
    { key: 'hco3' as const, label: 'HCO₃', value: hco3, setter: setHco3, unit: 'mEq/L' },
    { key: 'albumin' as const, label: 'Albumin', value: albumin, setter: setAlbumin, unit: 'g/dL' },
  ], [na, cl, hco3, albumin]);

  const naVal = parseFloat(na);
  const clVal = parseFloat(cl);
  const hco3Val = parseFloat(hco3);
  const albVal = parseFloat(albumin);

  const calculateAG = () => {
    if (isNaN(naVal) || isNaN(clVal) || isNaN(hco3Val)) return null;
    return naVal - (clVal + hco3Val);
  };

  const calculateCorrectedAG = (ag: number) => {
    if (isNaN(albVal)) return null;
    return ag + 2.5 * (4.4 - albVal);
  };

  const calculateDeltaRatio = (effectiveAG: number) => {
    if (isNaN(hco3Val)) return null;
    const deltaAG = effectiveAG - 12;
    const deltaHCO3 = 24 - hco3Val;
    if (deltaHCO3 === 0) return null;
    return deltaAG / deltaHCO3;
  };

  const ag = calculateAG();
  const correctedAg = ag !== null ? calculateCorrectedAG(ag) : null;
  // Use correctedAg for delta ratio when albumin is available for accuracy
  const effectiveAGForDelta = correctedAg !== null ? correctedAg : ag;
  const deltaRatio = effectiveAGForDelta !== null ? calculateDeltaRatio(effectiveAGForDelta) : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/calculator" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Anion Gap
        </h1>
      </div>

      <ActivePatientBriefCard />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Natrium (Na) <span className="text-xs text-slate-500 font-normal">(mEq/L)</span>
          </label>
          <input
            type="number"
            value={na}
            onChange={(e) => setNa(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="140"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Klorida (Cl) <span className="text-xs text-slate-500 font-normal">(mEq/L)</span>
          </label>
          <input
            type="number"
            value={cl}
            onChange={(e) => setCl(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="104"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bikarbonat (HCO₃) <span className="text-xs text-slate-500 font-normal">(mEq/L)</span>
          </label>
          <input
            type="number"
            value={hco3}
            onChange={(e) => setHco3(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Albumin <span className="text-xs text-slate-500 font-normal">(g/dL, Opsional)</span>
          </label>
          <input
            type="number"
            value={albumin}
            onChange={(e) => setAlbumin(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="4.4"
            step="0.1"
          />
        </div>
      </div>

      {(ag !== null) && <InputWarning messages={[
        rangeWarning(naVal, 100, 180, 'Na', ' mEq/L'),
        rangeWarning(clVal, 70, 130, 'Cl', ' mEq/L'),
        rangeWarning(hco3Val, 3, 45, 'HCO₃', ' mEq/L'),
      ]} />}
      {(ag !== null) && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-sm text-primary mb-1">Anion Gap (AG)</div>
            <div className="text-3xl font-bold text-primary">
              {ag.toFixed(1)} <span className="text-base font-normal">mEq/L</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Normal: 8 - 12 mEq/L
            </div>
          </div>

          {correctedAg !== null && (
            <div className="pt-3 border-t border-primary/20">
              <div className="text-sm text-primary mb-1">Corrected Anion Gap</div>
              <div className="text-xl font-bold text-primary">
                {correctedAg.toFixed(1)} <span className="text-sm font-normal">mEq/L</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Delta Ratio menggunakan Corrected AG untuk akurasi
              </div>
            </div>
          )}

          {deltaRatio !== null && (
            <div className="pt-3 border-t border-primary/20">
              <div className="text-sm text-primary mb-1">Delta Ratio (ΔAG / ΔHCO₃)</div>
              <div className="text-xl font-bold text-primary">
                {deltaRatio.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                {deltaRatio < 0.4 && <div className="font-semibold text-destructive">{'< 0.4: Hyperchloremic normal AG acidosis'}</div>}
                {deltaRatio >= 0.4 && deltaRatio < 0.8 && <div className="font-semibold text-amber-600 dark:text-amber-400">{'0.4 - 0.8: Mixed normal & high AG acidosis'}</div>}
                {deltaRatio >= 0.8 && deltaRatio <= 2.0 && <div className="font-semibold text-emerald-600 dark:text-emerald-400">{'0.8 - 2.0: Pure high AG acidosis'}</div>}
                {deltaRatio > 2.0 && <div className="font-semibold text-destructive">{'> 2.0: High AG acidosis + concurrent metabolic alkalosis'}</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {(ag !== null) && (
        <CalcSteps
          tone="blue"
          steps={[
            {
              label: 'Langkah 1 — Anion Gap:',
              formula: `AG = Na − (Cl + HCO₃) = ${naVal} − (${clVal} + ${hco3Val}) = ${ag.toFixed(1)} mEq/L`,
              note: 'Normal 8-12 mEq/L. Meningkat pada penumpukan asam tak terukur (laktat, keton, uremia, intoksikasi).',
            },
            ...(correctedAg !== null ? [{
              label: 'Langkah 2 — Koreksi terhadap albumin:',
              formula: `AG terkoreksi = AG + 2.5 × (4.4 − albumin)\n= ${ag.toFixed(1)} + 2.5 × (4.4 − ${albVal}) = ${correctedAg.toFixed(1)} mEq/L`,
              note: 'Tiap penurunan 1 g/dL albumin menutupi ~2.5 mEq/L AG — wajib dikoreksi pada hipoalbuminemia ICU.',
            }] : []),
            ...(deltaRatio !== null ? [{
              label: `Langkah ${correctedAg !== null ? 3 : 2} — Delta Ratio:`,
              formula: `ΔRatio = (AG${correctedAg !== null ? ' terkoreksi' : ''} − 12) ÷ (24 − HCO₃)\n= (${(effectiveAGForDelta as number).toFixed(1)} − 12) ÷ (24 − ${hco3Val}) = ${deltaRatio.toFixed(2)}`,
              note: '<0.4 asidosis AG normal (hiperkloremik) · 0.8-2.0 murni AG tinggi · >2.0 disertai alkalosis metabolik.',
            }] : []),
          ]}
          footer="Anion gap membantu mempersempit diagnosis banding asidosis — interpretasikan bersama pH, laktat, dan konteks klinis."
        />
      )}

      {(ag !== null) && (
        <ClinicalReport
          title="Kalkulator Anion Gap"
          patientInfo={{ name: patient.nama || '' }}
          sections={[
            {
              title: 'Input Laboratorium',
              items: [
                { label: 'Natrium (Na)', value: `${na} mEq/L` },
                { label: 'Klorida (Cl)', value: `${cl} mEq/L` },
                { label: 'Bikarbonat (HCO₃)', value: `${hco3} mEq/L` },
                ...(albumin ? [{ label: 'Albumin', value: `${albumin} g/dL` }] : [])
              ]
            },
            {
              title: 'Hasil Evaluasi',
              items: [
                { label: 'Anion Gap', value: `${ag.toFixed(1)} mEq/L` },
                ...(correctedAg !== null ? [{ label: 'Corrected AG', value: `${correctedAg.toFixed(1)} mEq/L` }] : []),
                ...(deltaRatio !== null ? [{ label: 'Delta Ratio', value: deltaRatio.toFixed(2) }] : [])
              ]
            }
          ]}
          notes={deltaRatio !== null ? (
            deltaRatio < 0.4 ? '< 0.4: Hyperchloremic normal AG acidosis' :
            deltaRatio < 0.8 ? '0.4 - 0.8: Mixed normal & high AG acidosis' :
            deltaRatio <= 2.0 ? '0.8 - 2.0: Pure high AG acidosis' :
            '> 2.0: High AG acidosis + concurrent metabolic alkalosis'
          ) : undefined}
        />
      )}

      {(ag !== null) && (
        <SaveToHistoryButton
          module="anion_gap"
          label={`Anion Gap: ${ag.toFixed(1)}`}
          inputs={{ na, cl, hco3, albumin }}
          summary={`AG ${ag.toFixed(1)} mEq/L${correctedAg !== null ? ` (Corr: ${correctedAg.toFixed(1)})` : ''}${deltaRatio !== null ? ` · Delta Ratio: ${deltaRatio.toFixed(2)}` : ''}`}
          className="w-full"
        />
      )}

      <Accordion title="📖 Teori & Referensi: Anion Gap & Delta Ratio">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong>Anion Gap (AG):</strong> Na - (Cl + HCO₃). Normalnya 8-12 mEq/L. High AG acidosis menunjukkan asidosis akibat penumpukan asam tak terukur (Ketoasidosis, Laktat, Uremia, Intoksikasi).</li>
          <li><strong>Corrected AG:</strong> AG + 2.5 × (4.4 - Albumin). Albumin adalah anion dominan; pada hipoalbuminemia, AG normal terlihat lebih rendah dari yang sebenarnya. Koreksi wajib untuk akurasi.</li>
          <li><strong>Delta Ratio (ΔAG / ΔHCO₃):</strong> Menggunakan Corrected AG jika albumin tersedia. (AG efektif - 12) / (24 - HCO₃ pasien). Nilai 0.8–2.0 = pure high AG acidosis.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007;2(1):162-174.
        </div>
      </Accordion>
    </div>
  );
}
