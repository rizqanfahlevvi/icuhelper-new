import { useState } from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePatientStore } from '../../store/usePatientStore';
import { ClinicalReport } from '../../components/ui/ClinicalReport';

export default function KalkulatorAnionGap() {
  const patient = usePatientStore();
  const [na, setNa] = useState<string>('');
  const [cl, setCl] = useState<string>('');
  const [hco3, setHco3] = useState<string>('');
  const [albumin, setAlbumin] = useState<string>('');

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

  const calculateDeltaRatio = (ag: number) => {
    if (isNaN(hco3Val)) return null;
    const deltaAG = ag - 12;
    const deltaHCO3 = 24 - hco3Val;
    if (deltaHCO3 === 0) return null; // Avoid division by zero
    return deltaAG / deltaHCO3;
  };

  const ag = calculateAG();
  const correctedAg = ag !== null ? calculateCorrectedAG(ag) : null;
  const deltaRatio = ag !== null ? calculateDeltaRatio(ag) : null;

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/calculator" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Anion Gap
        </h1>
      </div>

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
                {deltaRatio >= 0.4 && deltaRatio < 0.8 && <div className="font-semibold text-warning">{'0.4 - 0.8: Mixed normal & high AG acidosis'}</div>}
                {deltaRatio >= 0.8 && deltaRatio <= 2.0 && <div className="font-semibold text-emerald-600 dark:text-emerald-400">{'0.8 - 2.0: Pure high AG acidosis'}</div>}
                {deltaRatio > 2.0 && <div className="font-semibold text-destructive">{'> 2.0: High AG acidosis + concurrent metabolic alkalosis'}</div>}
              </div>
            </div>
          )}
        </div>
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

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-400 space-y-2">
        <p><strong>Rumus Anion Gap:</strong> Na - (Cl + HCO₃)</p>
        <p><strong>Corrected AG:</strong> AG + 2.5 × (4.4 - Albumin)</p>
        <p>Corrected AG digunakan bila pasien mengalami hipoalbuminemia, karena albumin adalah anion tak terukur utama. Penurunan 1 g/dL albumin menurunkan AG sekitar 2.5 mEq/L.</p>
      </div>
    </div>
  );
}
