import { useState } from 'react';
import { AbgInputs } from './types';
import { Calculator, AlertTriangle } from 'lucide-react';
import {
  bicarbDeficit, bicarbSpaceFernandez, recommendBicarbFactor,
  anionGap, deltaRatio, normalizeAgUpper, DELTA_BAND_LABEL, DELTA_RATIO_CAUTION, AG_ALBUMIN_NORMAL_G_DL, hclPlan,
} from '../../utils/acidBase';
import { K_DEFICIT_FACTOR } from '../../utils/electrolytes';
import { useSettingsStore } from '../../store/settingsStore';
import { AgUpperNormalField } from '../../components/ui/AgUpperNormalField';

interface Props {
  abgInputs: AbgInputs;
}

export default function AcidBaseCorrection({ abgInputs }: Props) {
  const [activeTab, setActiveTab] = useState(1);
  const agUpper = normalizeAgUpper(useSettingsStore(s => s.agUpperNormal));

  // Tab 1 state
  const [bb, setBb] = useState('');
  const [hco3act, setHco3act] = useState('');
  const [hco3tgt, setHco3tgt] = useState('18');
  const [type1, setType1] = useState('met');
  const [factorChoice, setFactorChoice] = useState('auto'); // 'auto' | '0.5' | '0.6' | '0.8'

  // Tab 2 state
  const [bb2, setBb2] = useState('');
  const [hco3act2, setHco3act2] = useState('');
  const [k, setK] = useState('');
  const [urineCl, setUrineCl] = useState('');
  const [hco3tgt2, setHco3tgt2] = useState('');

  // Tab 3 state
  const [ph3, setPh3] = useState('');
  const [pco23, setPco23] = useState('');
  const [hco3act3, setHco3act3] = useState('');
  const [disorder, setDisorder] = useState('');

  // Tab 4 state
  const [na4, setNa4] = useState('');
  const [cl4, setCl4] = useState('');
  const [hco3act4, setHco3act4] = useState('');
  const [alb4, setAlb4] = useState('4.0');

  const importData = () => {
    if (activeTab === 1) {
      if (abgInputs.hco3) setHco3act(abgInputs.hco3);
    } else if (activeTab === 2) {
      if (abgInputs.hco3) setHco3act2(abgInputs.hco3);
    } else if (activeTab === 3) {
      if (abgInputs.ph) setPh3(abgInputs.ph);
      if (abgInputs.pco2) setPco23(abgInputs.pco2);
      if (abgInputs.hco3) setHco3act3(abgInputs.hco3);
    } else if (activeTab === 4) {
      if (abgInputs.na) setNa4(abgInputs.na);
      if (abgInputs.cl) setCl4(abgInputs.cl);
      if (abgInputs.hco3) setHco3act4(abgInputs.hco3);
      if (abgInputs.alb) setAlb4(abgInputs.alb);
    }
    if (!abgInputs.ph && !abgInputs.pco2 && !abgInputs.hco3 && !abgInputs.na) {
      alert('Belum ada nilai yang diisi. Isi form ABG di atas.');
    }
  };

  const renderTab1 = () => {
    let target = parseFloat(hco3tgt);
    if (type1 === 'dka') target = 15;
    if (type1 === 'card') target = 14;

    const b = parseFloat(bb);
    const act = parseFloat(hco3act);
    const rec = recommendBicarbFactor(act);
    const factor = factorChoice === 'auto' ? rec.factor : parseFloat(factorChoice);
    const deficit = (!isNaN(b) && !isNaN(act)) ? bicarbDeficit(factor, b, target, act) : 0;
    const isLargeDose = deficit > 150;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">BBI (kg)</label>
            <input type="number" value={bb} onChange={e=>setBb(e.target.value)} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full min-w-0" placeholder="e.g. 60" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">HCO₃ Aktual</label>
            <input type="number" value={hco3act} onChange={e=>setHco3act(e.target.value)} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full min-w-0" placeholder="e.g. 10" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Target HCO₃</label>
            <input type="number" value={hco3tgt} onChange={e=>setHco3tgt(e.target.value)} disabled={type1 !== 'met'} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full min-w-0 disabled:opacity-50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Jenis Asidosis</label>
            <select value={type1} onChange={e=>setType1(e.target.value)} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full min-w-0 appearance-none">
              <option value="met">Asidosis Metabolik</option>
              <option value="dka">DKA (target 15)</option>
              <option value="card">Cardiac Arrest (bolus)</option>
            </select>
          </div>
        </div>

        {type1 !== 'card' && (
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Faktor Ruang Distribusi HCO₃ (L/kg)</span>
              {!isNaN(act) && <span className="text-[11px] text-[var(--label-secondary)]">Fernandez: 0.4 + 2.6/{act} = <strong className="text-[var(--label-primary)]">{bicarbSpaceFernandez(act).toFixed(2)}</strong></span>}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[['auto', `Auto (${!isNaN(act) ? rec.factor : '—'})`], ['0.5','0.5'], ['0.6','0.6'], ['0.8','0.8']].map(([val, lbl]) => (
                <button key={val} type="button" onClick={()=>setFactorChoice(val)} className={`py-2 rounded-lg text-[12px] font-bold border transition-colors ${factorChoice === val ? 'bg-primary/15 border-primary/50 text-primary' : 'bg-white dark:bg-[#2C2C2E] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}>{lbl}</button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--label-secondary)] leading-relaxed">
              Ruang distribusi bikarbonat <strong>membesar saat asidosis makin berat</strong> — 0.4–0.5 pada asidosis ringan; 0.6–0.8 saat HCO₃ sangat rendah. Mode <strong>Auto</strong> menyarankan {!isNaN(act) ? <>{rec.factor} ({rec.label})</> : 'berdasarkan HCO₃ aktual'}.
            </p>
            <p className="text-[11px] text-[var(--label-secondary)] leading-relaxed border-t border-slate-200 dark:border-slate-700/50 pt-2">
              <strong>Target HCO₃:</strong> rentang tersarankan <strong>15–18 mEq/L</strong> (koreksi parsial, bukan normalisasi). Sesuaikan komorbid: hipernatremia/overload cairan → waspada beban Na &amp; volume dari NaHCO₃; hipokalsemia → alkalinisasi cepat dapat memicu tetani; AKI → risiko akumulasi.
            </p>
          </div>
        )}

        {!isNaN(b) && !isNaN(act) && (
          <div className="p-4 border border-slate-200 bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50 rounded-xl space-y-2">
            {type1 === 'card' ? (
              <>
                 <div className="text-sm font-bold text-primary mb-2">Cardiac Arrest — Bolus NaHCO₃ 8.4%</div>
                 <div className="text-2xl font-black text-[var(--label-primary)]">{b.toFixed(0)} mEq</div>
                 <div className="text-sm text-[var(--label-secondary)] font-medium">(= {b.toFixed(0)} mL NaHCO₃ 8.4% IV bolus)</div>
                 <div className="text-xs font-mono text-[var(--label-secondary)] mt-2">Dosis: 1 mEq/kg BB IV bolus. Ulangi tiap 10 menit jika diperlukan.</div>
                 <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-medium text-amber-600 dark:text-amber-400">⚠ AHA 2020: NaHCO₃ RUTIN tidak direkomendasikan pada henti jantung — pertimbangkan hanya pada kondisi khusus (hiperkalemia, overdosis antidepresan trisiklik/penghambat kanal Na).</div>
              </>
            ) : act >= target ? (
              <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">HCO₃⁻ aktual ({act}) sudah mencapai target ({target}). Tidak perlu koreksi.</div>
            ) : (
              <>
                 <div className="text-sm font-bold text-primary mb-2">Dosis NaHCO₃ — {type1 === 'dka' ? 'DKA' : 'Asidosis Metabolik'}</div>
                 <div className="text-2xl font-black text-primary">{deficit.toFixed(0)} mEq</div>
                 <div className="text-sm text-[var(--label-primary)] font-medium mt-1">Berikan ½ dosis dulu: <strong className="text-primary">{(deficit / 2).toFixed(0)} mEq</strong> dalam 4–6 jam, lalu re-evaluasi AGD.</div>

                 {isLargeDose && (
                   <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-[12px] text-rose-800 dark:text-rose-300">
                     <strong className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Dosis besar (&gt;150 mEq) — JANGAN bolus penuh</strong>
                     <p className="mt-1 leading-relaxed">Berikan bertahap (mulai ½ dosis / infus lambat), cek AGD ulang tiap 2–4 jam. Koreksi HCO₃ berlebih berisiko alkalosis overshoot, hipokalemia, hipokalsemia (tetani), Na overload, dan pergeseran kurva O₂. NaHCO₃ hanya diindikasikan pada asidosis metabolik berat tertentu (mis. pH &lt;7.1) — bukan rutin.</p>
                   </div>
                 )}

                 <hr className="my-3 border-slate-200 dark:border-slate-700/50" />
                 <div className="text-xs text-[var(--label-secondary)] font-medium leading-relaxed">
                   <strong className="text-[var(--label-primary)]">Sediaan:</strong><br/>
                   • NaHCO₃ 8.4% (1 mEq/mL) → <strong className="text-[var(--label-primary)]">{deficit.toFixed(0)} mL</strong><br/>
                   • NaHCO₃ 7.5% (0.9 mEq/mL) → <strong className="text-[var(--label-primary)]">{(deficit / 0.9).toFixed(0)} mL</strong>
                 </div>
                 <div className="text-[11px] font-mono font-medium text-slate-500 mt-2 border-t border-slate-200 dark:border-slate-700/50 pt-2 leading-relaxed">
                   Langkah: Defisit HCO₃⁻ = faktor × BBI × (target − aktual)<br/>
                   = {factor} × {b} × ({target} − {act}) = <strong className="text-[var(--label-primary)]">{deficit.toFixed(0)} mEq</strong><br/>
                   Faktor {factor} L/kg = ruang distribusi bikarbonat{factorChoice === 'auto' ? ` (Auto — ${rec.label})` : ' (dipilih manual)'}. Berikan ½ dulu, re-evaluasi AGD.
                 </div>
              </>
            )}
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-mono font-bold leading-relaxed">📚 Faktor 0.4–0.5 konvensional: Seifter JL. NEJM 2014; Berend K. NEJM 2018 · Ruang distribusi bergantung severity: Fernandez PC, et al. Kidney Int 1989;36:747; Adrogué HJ, Madias NE. NEJM 1998;338:26</div>
          </div>
        )}
      </div>
    );
  };

  const renderTab2 = () => {
    const b = parseFloat(bb2);
    const act = parseFloat(hco3act2);
    const kal = parseFloat(k);
    const uCl = parseFloat(urineCl);
    const tgt = parseFloat(hco3tgt2);
    const hcl = hclPlan(b, act, tgt);
    const inputCls = 'px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full min-w-0';
    const labelCls = 'text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider';

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className={labelCls}>BB (kg)</label>
            <input type="number" value={bb2} onChange={e=>setBb2(e.target.value)} className={inputCls} placeholder="e.g. 60" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>HCO₃ Aktual</label>
            <input type="number" value={hco3act2} onChange={e=>setHco3act2(e.target.value)} className={inputCls} placeholder="e.g. 38" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Kalium K⁺</label>
            <input type="number" value={k} onChange={e=>setK(e.target.value)} className={inputCls} placeholder="e.g. 2.8" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Cl⁻ URIN spot</label>
            <input type="number" value={urineCl} onChange={e=>setUrineCl(e.target.value)} className={inputCls} placeholder="mEq/L" />
          </div>
        </div>

        {!isNaN(b) && !isNaN(act) && (
          <div className="space-y-3">
             {act <= 26 ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-500/20 font-bold rounded-xl">HCO₃⁻ {act} mEq/L ≤ 26. Tidak ada alkalosis metabolik untuk dikoreksi.</div>
             ) : (
                <>
                  {!isNaN(uCl) ? (
                    <div className={`p-4 border rounded-xl ${uCl < 20 ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                       <div className={`font-bold text-sm mb-1 ${uCl < 20 ? 'text-amber-700 dark:text-amber-400' : 'text-primary'}`}>{uCl < 20 ? '✅ Chloride-Responsive (Cl⁻ urin <20)' : '⚡ Chloride-Resistant (Cl⁻ urin ≥20)'}</div>
                       <div className="text-xs font-medium text-[var(--label-secondary)]">{uCl < 20 ? 'Kemungkinan penyebab: muntah, NG suction, pasca-diuretik. Koreksi dengan NaCl isotonis + KCl.' : 'Kemungkinan penyebab: hiperaldosteronisme, Cushing, Bartter/Gitelman — atau pasien masih dalam efek diuretik (Cl⁻ urin tinggi). Tangani penyebab primer.'}</div>
                    </div>
                  ) : (
                    <div className="p-3 border rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50 text-xs font-medium text-[var(--label-secondary)]">
                      Isi <strong>Cl⁻ urin spot</strong> untuk membedakan chloride-responsive vs resistant. Cl⁻ serum tidak dapat dipakai untuk klasifikasi ini.
                    </div>
                  )}

                  {!isNaN(kal) && (
                    <div className={`p-4 border rounded-xl ${kal < 3.5 ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                       <div className="font-bold text-sm mb-2 text-[var(--label-primary)]">Koreksi KCl IV</div>
                       <div className="text-xl font-black text-primary mb-1">{4.0 - kal > 0 ? ((4.0 - kal) * K_DEFICIT_FACTOR * b).toFixed(0) + ' mEq' : 'K⁺ cukup'}</div>
                       {4.0 - kal > 0 && <div className="text-xs font-medium text-[var(--label-secondary)]">Laju ≤10 mEq/jam via perifer atau ≤20 mEq/jam via sentral (selaras Kalkulator Elektrolit). Rumatan harian & protokol lengkap: Kalkulator Elektrolit → Kalium.</div>}
                       <div className="text-[11px] font-mono mt-2 text-slate-500">Defisit K⁺ ≈ (4.0 − {kal}) × {K_DEFICIT_FACTOR} × {b}</div>
                    </div>
                  )}

                  {act >= 40 && (
                     <div className="p-4 border border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10 rounded-xl space-y-2">
                        <div className="font-bold text-sm text-rose-600 dark:text-rose-400">HCl 0,1 N — Alkalosis Metabolik Berat (HCO₃⁻ ≥ 40)</div>
                        <div className="text-xs font-medium text-[var(--label-secondary)]">Hanya untuk alkalosis berat/refrakter bergejala (mis. pH &gt;7,55) bila koreksi Cl⁻/K⁺ tidak cukup atau saline dikontraindikasikan.</div>
                        <div className="flex items-center gap-2">
                          <label className={labelCls}>Target HCO₃⁻</label>
                          <input type="number" value={hco3tgt2} onChange={e=>setHco3tgt2(e.target.value)} className="w-24 px-3 py-2 bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none" placeholder="isi" />
                          <span className="text-[11px] text-slate-500">mEq/L — tidak ada angka baku; koreksi parsial, bukan normalisasi</span>
                        </div>
                        {hcl ? (
                          <>
                            <div className="text-xl font-black text-rose-600 dark:text-rose-400">{hcl.doseMeq.toFixed(0)} mEq HCl</div>
                            <div className="text-xs font-medium text-[var(--label-secondary)]">
                              = <strong className="text-[var(--label-primary)]">{hcl.volume01NmL.toFixed(0)} mL HCl 0,1 N</strong> (0,1 mEq/mL) via kateter vena sentral.<br/>
                              Laju maks 0,2 mEq/kg/jam = <strong className="text-[var(--label-primary)]">{hcl.maxRateMeqH.toFixed(1)} mEq/jam ({hcl.maxRateMlH.toFixed(0)} mL/jam)</strong> → durasi minimal <strong className="text-[var(--label-primary)]">{hcl.minHours.toFixed(1)} jam</strong>. Pantau AGD & elektrolit serial.
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">Defisit H⁺ = 0,5 × BB × (HCO₃ aktual − target) = 0,5 × {b} × ({act} − {tgt}) = {hcl.doseMeq.toFixed(0)} mEq</div>
                            <div className="text-[11px] text-slate-500">Estimasi saja — tidak memperhitungkan kehilangan asam berlanjut (mis. NGT). Konsentrasi &gt;0,1 N dilaporkan korosif walau lewat CVC.</div>
                          </>
                        ) : (
                          <div className="text-xs font-medium text-[var(--label-secondary)]">Isi target HCO₃⁻ (lebih rendah dari HCO₃⁻ aktual) untuk menghitung dosis.</div>
                        )}
                     </div>
                  )}
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-mono font-bold ml-1">📚 Emmett M. CJASN 2020 · Galla JH. JASN 2000 · Gennari FJ. NEJM 1998 (hipokalemia) · HCl: faktor 0,5 × BB & laju ≤0,2 mEq/kg/jam (rujukan farmasi klinis; keputusan pemilik)</div>
                </>
             )}
          </div>
        )}
      </div>
    );
  };

  const renderTab3 = () => {
    return (
       <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-center font-medium text-slate-500">
          Fitur ini tersedia otomatis di <strong>Langkah 3</strong> pada ABG Interpreter di atas.
       </div>
    );
  };

  const renderTab4 = () => {
    const n = parseFloat(na4);
    const c = parseFloat(cl4);
    const h = parseFloat(hco3act4);
    const a = parseFloat(alb4);

    if (isNaN(n) || isNaN(c) || isNaN(h)) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <input type="number" value={na4} onChange={e=>setNa4(e.target.value)} placeholder="Na+" className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" />
          <input type="number" value={cl4} onChange={e=>setCl4(e.target.value)} placeholder="Cl-" className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" />
          <input type="number" value={hco3act4} onChange={e=>setHco3act4(e.target.value)} placeholder="HCO3-" className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" />
          <input type="number" value={alb4} onChange={e=>setAlb4(e.target.value)} placeholder="Albumin" className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" />
        </div>
      );
    }

    const agRes = anionGap(n, c, h, isNaN(a) ? null : a, agUpper);
    if (!agRes) return null;
    const ag = agRes.ag;
    const agCorr = agRes.effective;
    const agHigh = agRes.high;

    let ddHtml = null;
    if (agHigh) {
      const dd = deltaRatio(agCorr, h, agRes.upper);
      ddHtml = (
         <div className="p-4 border border-indigo-200 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10 rounded-xl mt-3">
           <div className="font-bold text-sm mb-1 text-indigo-800 dark:text-indigo-400">Delta-Delta Ratio</div>
           <div className="text-xl font-black text-[var(--label-primary)] mb-1">{dd.ratio !== null ? dd.ratio.toFixed(2) : 'tidak terdefinisi'}</div>
           <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
             {dd.ratio !== null && dd.band ? DELTA_BAND_LABEL[dd.band] : `HCO₃⁻ ${h} ≥ 24 meski AG naik → pola HAGMA + alkalosis metabolik bersamaan`}
           </div>
           <div className="text-[11px] font-mono text-slate-500 mt-2">Δ/Δ = (AG{agRes.agCorr !== null ? ' terkoreksi' : ''} − {agRes.upper}) ÷ (24 − HCO₃⁻) = ({agCorr.toFixed(1)} − {agRes.upper}) ÷ (24 − {h})</div>
           <div className="text-[11px] text-slate-500 mt-1">{DELTA_RATIO_CAUTION}</div>
         </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Na⁺</label><input type="number" value={na4} onChange={e=>setNa4(e.target.value)} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Cl⁻</label><input type="number" value={cl4} onChange={e=>setCl4(e.target.value)} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">HCO₃⁻</label><input type="number" value={hco3act4} onChange={e=>setHco3act4(e.target.value)} className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Albumin (opt)</label><input type="number" value={alb4} onChange={e=>setAlb4(e.target.value)} placeholder="4.0" className="px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70 w-full" /></div>
        </div>
        
        <div className={`p-4 border rounded-xl ${agHigh ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
           <div className={`font-bold text-sm mb-1 ${agHigh ? 'text-rose-600 dark:text-rose-400' : 'text-primary'}`}>Anion Gap {agRes.agCorr !== null ? '(Terkoreksi)' : ''}</div>
           <div className="text-2xl font-black text-[var(--label-primary)] mb-1">{agCorr.toFixed(1)} mEq/L <span className="text-sm font-bold text-[var(--label-secondary)]">{agHigh ? '↑ HAGMA' : 'Normal'}</span></div>
           <div className="text-[11px] font-mono text-slate-500 font-medium mt-2 border-t border-slate-200 dark:border-slate-700/50 pt-2">
             AG = {n} − ({c} + {h}) = {ag.toFixed(1)} {agRes.agCorr !== null && `| AG + 2,5 × (${AG_ALBUMIN_NORMAL_G_DL.toFixed(1)} − ${a}) = ${agRes.agCorr.toFixed(1)}`} · batas atas normal {agRes.upper}
           </div>
           {agRes.albuminSuspectUnit && (
             <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">Albumin {a} &gt; 7 g/dL — kemungkinan satuan g/L (35 g/L = 3,5 g/dL). Koreksi albumin tidak dihitung.</div>
           )}
        </div>
        
        {ddHtml}

        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/40">
          <AgUpperNormalField />
        </div>

        <div className="p-4 border border-slate-200 bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50 rounded-xl">
           <div className="font-bold text-sm mb-1 text-[var(--label-secondary)]">Selisih Na⁺ − Cl⁻ (pengganti kasar SID)</div>
           <div className="text-xl font-black text-[var(--label-primary)] mb-1">{(n - c).toFixed(1)} mEq/L</div>
           <div className="text-[11px] font-mono font-medium text-slate-500">Na⁺ − Cl⁻ — BUKAN SID sebenarnya. SID apparent = (Na⁺ + K⁺ + Ca²⁺ + Mg²⁺) − (Cl⁻ + laktat).</div>
        </div>
        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold ml-1">📚 Wrenn K. Ann Emerg Med 1990; Stewart PA. Can J Physiol Pharmacol 1983</div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm w-full mt-6">
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-[15px] font-bold text-[var(--label-primary)] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Kalkulator Koreksi Asam-Basa
        </h2>
        <p className="text-xs font-medium text-[var(--label-secondary)] mt-1">
          Hitung dosis koreksi, formula kompensasi, dan analisis anion gap.
        </p>
      </div>
      <div className="p-0">
        
        <div className="flex w-full border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab(1)} className={`flex-1 min-w-[100px] py-3 text-[13px] font-bold transition-colors ${activeTab === 1 ? 'border-b-2 border-primary text-[var(--label-primary)] bg-primary/5' : 'text-[var(--label-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>🧪 NaHCO₃</button>
          <button onClick={() => setActiveTab(2)} className={`flex-1 min-w-[100px] py-3 text-[13px] font-bold transition-colors ${activeTab === 2 ? 'border-b-2 border-primary text-[var(--label-primary)] bg-primary/5' : 'text-[var(--label-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>⚗️ KCl / HCl</button>
          <button onClick={() => setActiveTab(3)} className={`flex-1 min-w-[100px] py-3 text-[13px] font-bold transition-colors ${activeTab === 3 ? 'border-b-2 border-primary text-[var(--label-primary)] bg-primary/5' : 'text-[var(--label-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>📐 Kompensasi</button>
          <button onClick={() => setActiveTab(4)} className={`flex-1 min-w-[100px] py-3 text-[13px] font-bold transition-colors ${activeTab === 4 ? 'border-b-2 border-primary text-[var(--label-primary)] bg-primary/5' : 'text-[var(--label-secondary)] hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>🔬 AG + Δ/Δ</button>
        </div>

        <div className="p-4 sm:p-5">
          <button onClick={importData} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-5 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-[13px] font-extrabold shadow-sm active:scale-[0.98]">
            ⬇ Import dari ABG Interpreter di atas
          </button>

          {activeTab === 1 && renderTab1()}
          {activeTab === 2 && renderTab2()}
          {activeTab === 3 && renderTab3()}
          {activeTab === 4 && renderTab4()}
        </div>
      </div>
    </div>
  );
}
