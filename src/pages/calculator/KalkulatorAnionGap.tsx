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
import { AgUpperNormalField } from '../../components/ui/AgUpperNormalField';
import { useSettingsStore } from '../../store/settingsStore';
import {
  anionGap, deltaRatio, normalizeAgUpper, DELTA_BAND_LABEL, DELTA_RATIO_CAUTION, AG_ALBUMIN_NORMAL_G_DL,
} from '../../utils/acidBase';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { CalcActionBar } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import { DecimalInput } from '../../components/ui/DecimalInput';

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

  const agUpper = normalizeAgUpper(useSettingsStore(st => st.agUpperNormal));
  const agRes = anionGap(naVal, clVal, hco3Val, isNaN(albVal) ? null : albVal, agUpper);
  const ag = agRes ? agRes.ag : null;
  const correctedAg = agRes ? agRes.agCorr : null;
  const effectiveAGForDelta = agRes ? agRes.effective : null;
  // Delta ratio hanya bermakna bila AG (terkoreksi) tinggi.
  const dd = agRes && agRes.high ? deltaRatio(agRes.effective, hco3Val, agRes.upper) : null;
  const deltaRatioVal = dd ? dd.ratio : null;
  const deltaText = dd
    ? (dd.ratio !== null && dd.band ? DELTA_BAND_LABEL[dd.band] : `HCO₃⁻ ${hco3Val} ≥ 24 meski AG naik → rasio tidak terdefinisi; pola HAGMA + alkalosis metabolik bersamaan`)
    : null;
  const deltaTone = dd?.band === 'murni' ? 'text-emerald-600 dark:text-emerald-400' : dd?.band === 'campuran' ? 'text-amber-600 dark:text-amber-400' : 'text-destructive';

  // Hitung sekali → hasil tampil & selalu mengikuti input (nilai turunan dihitung tiap render).
  const calc = useCalcTrigger({
    compute: () => {},
    deps: [],
    required: [
      { id: 'ag-na', label: 'Na', filled: !isNaN(naVal) },
      { id: 'ag-cl', label: 'Cl', filled: !isNaN(clVal) },
      { id: 'ag-hco3', label: 'HCO₃', filled: !isNaN(hco3Val) },
    ],
  });
  const show = calc.armed && ag !== null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="hidden md:flex items-center gap-3 mb-6">
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
          <DecimalInput
            id="ag-na"
            inputMode="decimal"
            aria-invalid={calc.isMissing('ag-na')}
            value={na}
            onChange={(e) => setNa(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--sys-red)]"
            placeholder="140"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Klorida (Cl) <span className="text-xs text-slate-500 font-normal">(mEq/L)</span>
          </label>
          <DecimalInput
            id="ag-cl"
            inputMode="decimal"
            aria-invalid={calc.isMissing('ag-cl')}
            value={cl}
            onChange={(e) => setCl(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--sys-red)]"
            placeholder="104"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bikarbonat (HCO₃) <span className="text-xs text-slate-500 font-normal">(mEq/L)</span>
          </label>
          <DecimalInput
            id="ag-hco3"
            inputMode="decimal"
            aria-invalid={calc.isMissing('ag-hco3')}
            value={hco3}
            onChange={(e) => setHco3(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--sys-red)]"
            placeholder="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Albumin <span className="text-xs text-slate-500 font-normal">(g/dL, Opsional)</span>
          </label>
          <DecimalInput
            inputMode="decimal"
            value={albumin}
            onChange={(e) => setAlbumin(e.target.value)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--sys-red)]"
            placeholder="4.0"
            step="0.1"
          />
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <AgUpperNormalField />
        </div>
      </div>

      {show && <InputWarning messages={[
        rangeWarning(naVal, 100, 180, 'Na', ' mEq/L'),
        rangeWarning(clVal, 70, 130, 'Cl', ' mEq/L'),
        rangeWarning(hco3Val, 3, 45, 'HCO₃', ' mEq/L'),
      ]} />}
      {show && (
        <div id="ag-hasil" className="scroll-mt-4 bg-primary/10 border border-primary/20 rounded-2xl p-5 space-y-4">
          <div>
            <div className="text-sm text-primary mb-1">Anion Gap (AG)</div>
            <div className="text-3xl font-bold text-primary">
              {ag.toFixed(1)} <span className="text-base font-normal">mEq/L</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Batas atas normal: {agUpper} mEq/L → {agRes?.high ? <strong className="text-destructive">AG TINGGI{correctedAg !== null ? ' (dinilai dari AG terkoreksi)' : ''}</strong> : <strong>normal</strong>}
            </div>
            {agRes?.albuminSuspectUnit && (
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-2">Albumin {albumin} &gt; 7 g/dL — kemungkinan satuan g/L (35 g/L = 3,5 g/dL). Koreksi albumin tidak dihitung.</div>
            )}
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

          {dd && (
            <div className="pt-3 border-t border-primary/20">
              <div className="text-sm text-primary mb-1">Delta Ratio (ΔAG / ΔHCO₃)</div>
              <div className="text-xl font-bold text-primary">
                {deltaRatioVal !== null ? deltaRatioVal.toFixed(2) : 'tidak terdefinisi'}
              </div>
              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                <div className={`font-semibold ${deltaTone}`}>{deltaText}</div>
                <div>{DELTA_RATIO_CAUTION}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {show && (
        <CalcSteps
          tone="blue"
          steps={[
            {
              label: 'Langkah 1 — Anion Gap:',
              formula: `AG = Na − (Cl + HCO₃) = ${naVal} − (${clVal} + ${hco3Val}) = ${ag.toFixed(1)} mEq/L`,
              note: `Batas atas normal ${agUpper} mEq/L (dapat disesuaikan dengan lab). Meningkat pada penumpukan asam tak terukur (laktat, keton, uremia, intoksikasi).`,
            },
            ...(correctedAg !== null ? [{
              label: 'Langkah 2 — Koreksi terhadap albumin:',
              formula: `AG terkoreksi = AG + 2.5 × (${AG_ALBUMIN_NORMAL_G_DL.toFixed(1)} − albumin)\n= ${ag.toFixed(1)} + 2.5 × (${AG_ALBUMIN_NORMAL_G_DL.toFixed(1)} − ${albVal}) = ${correctedAg.toFixed(1)} mEq/L`,
              note: 'Tiap penurunan 1 g/dL albumin menutupi ~2.5 mEq/L AG — wajib dikoreksi pada hipoalbuminemia ICU.',
            }] : []),
            ...(dd ? [{
              label: `Langkah ${correctedAg !== null ? 3 : 2} — Delta Ratio:`,
              formula: `ΔRatio = (AG${correctedAg !== null ? ' terkoreksi' : ''} − ${agUpper}) ÷ (24 − HCO₃)\n= (${(effectiveAGForDelta as number).toFixed(1)} − ${agUpper}) ÷ (24 − ${hco3Val}) = ${deltaRatioVal !== null ? deltaRatioVal.toFixed(2) : 'tidak terdefinisi (HCO₃ ≥ 24)'}`,
              note: `${deltaText} · Pita Wrenn: <0,4 NAGMA · 0,4–0,8 campuran · 0,8–2,0 HAGMA murni · >2,0 + alkalosis metabolik. ${DELTA_RATIO_CAUTION}`,
            }] : []),
          ]}
          footer="Anion gap membantu mempersempit diagnosis banding asidosis — interpretasikan bersama pH, laktat, dan konteks klinis."
        />
      )}

      {show && (
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
                ...(dd ? [{ label: 'Delta Ratio', value: deltaRatioVal !== null ? deltaRatioVal.toFixed(2) : 'tidak terdefinisi' }] : [])
              ]
            }
          ]}
          notes={deltaText ?? undefined}
        />
      )}

      {show && (
        <SaveToHistoryButton
          module="anion_gap"
          label={`Anion Gap: ${ag.toFixed(1)}`}
          inputs={{ na, cl, hco3, albumin }}
          summary={`AG ${ag.toFixed(1)} mEq/L${correctedAg !== null ? ` (Corr: ${correctedAg.toFixed(1)})` : ''}${deltaRatioVal !== null ? ` · Delta Ratio: ${deltaRatioVal.toFixed(2)}` : ''}`}
          className="w-full"
        />
      )}

      <Accordion title="📖 Teori & Referensi: Anion Gap & Delta Ratio">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong>Anion Gap (AG):</strong> Na - (Cl + HCO₃). Rentang klasik 8-12 mEq/L; analyzer ISE modern sering lebih rendah — atur batas atas sesuai lab Anda. High AG acidosis menunjukkan asidosis akibat penumpukan asam tak terukur (Ketoasidosis, Laktat, Uremia, Intoksikasi).</li>
          <li><strong>Corrected AG:</strong> AG + 2.5 × (4.0 - Albumin). Albumin adalah anion dominan; tiap penurunan 1 g/dL menurunkan AG ±2,5 mEq/L (Figge 1998). Acuan albumin normal 4,0 g/dL dipakai seragam di ABG, tab AG, dan kalkulator ini.</li>
          <li><strong>Delta Ratio (ΔAG / ΔHCO₃):</strong> Dihitung bila AG tinggi, memakai Corrected AG jika albumin tersedia: (AG efektif − batas atas normal) / (24 − HCO₃). Pita Wrenn: &lt;0,4 NAGMA dominan · 0,4–0,8 campuran · 0,8–2,0 HAGMA murni · &gt;2,0 + alkalosis metabolik. Rentang rasio antar pasien lebar — pakai sebagai petunjuk (Rastegar 2007).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007;2(1):162-174. · Figge J, et al. Anion gap and hypoalbuminemia. Crit Care Med. 1998;26:1807-10. · Wrenn K. The delta (Δ) gap: an approach to mixed acid-base disorders. Ann Emerg Med. 1990;19:1310-3. · Rastegar A. Use of the ΔAG/ΔHCO₃⁻ ratio in the diagnosis of mixed acid-base disorders. J Am Soc Nephrol. 2007;18:2429-31.
        </div>
      </Accordion>
      <CalcActionBar
        armed={calc.armed}
        onCalculate={calc.trigger}
        label="Hitung Anion Gap"
        summary={ag !== null ? `AG ${ag.toFixed(1)} mEq/L${correctedAg !== null ? ` · terkoreksi ${correctedAg.toFixed(1)}` : ''}` : null}
        summaryTone={agRes?.high ? 'bad' : 'neutral'}
        caption={ag !== null ? `${agRes?.high ? 'AG TINGGI' : 'Normal'} (batas atas ${agUpper})${deltaRatioVal !== null ? ` · Δ rasio ${deltaRatioVal.toFixed(2)}` : ''}` : undefined}
        missing={calc.missing}
        resultTargetId="ag-hasil"
      />
      <AbbrLegend terms={['AG', 'HAGMA', 'NAGMA', 'HCO3', 'ISE', 'ABG', 'ICU']} />
    </div>
  );
}
