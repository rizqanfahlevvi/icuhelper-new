import { useState } from 'react';
import { AbgInputs } from './types';
import { Calculator } from 'lucide-react';

interface Props {
  abgInputs: AbgInputs;
}

export default function AcidBaseCorrection({ abgInputs }: Props) {
  const [activeTab, setActiveTab] = useState(1);

  // Tab 1 state
  const [bb, setBb] = useState('');
  const [hco3act, setHco3act] = useState('');
  const [hco3tgt, setHco3tgt] = useState('18');
  const [type1, setType1] = useState('met');

  // Tab 2 state
  const [bb2, setBb2] = useState('');
  const [hco3act2, setHco3act2] = useState('');
  const [k, setK] = useState('');
  const [cl, setCl] = useState('');

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
      if (abgInputs.cl) setCl(abgInputs.cl);
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

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">BBI (kg)</label>
            <input type="number" value={bb} onChange={e=>setBb(e.target.value)} className="ios-input w-full" placeholder="e.g. 60" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">HCO₃ Aktual</label>
            <input type="number" value={hco3act} onChange={e=>setHco3act(e.target.value)} className="ios-input w-full" placeholder="e.g. 10" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Target HCO₃</label>
            <input type="number" value={hco3tgt} onChange={e=>setHco3tgt(e.target.value)} disabled={type1 !== 'met'} className="ios-input w-full disabled:opacity-50" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Jenis Asidosis</label>
            <select value={type1} onChange={e=>setType1(e.target.value)} className="ios-input w-full appearance-none">
              <option value="met">Asidosis Metabolik</option>
              <option value="dka">DKA (target 15)</option>
              <option value="card">Cardiac Arrest (bolus)</option>
            </select>
          </div>
        </div>

        {!isNaN(b) && !isNaN(act) && (
          <div className="ios-result-card space-y-2">
            {type1 === 'card' ? (
              <>
                 <div className="text-sm font-bold text-primary mb-2">Cardiac Arrest — Bolus NaHCO₃ 8.4%</div>
                 <div className="text-2xl font-black text-[var(--label-primary)]">{b.toFixed(0)} mEq</div>
                 <div className="text-sm text-[var(--label-secondary)] font-medium">(= {b.toFixed(0)} mL NaHCO₃ 8.4% IV bolus)</div>
                 <div className="text-xs font-mono text-[var(--label-secondary)] mt-2">Dosis: 1 mEq/kg BB IV bolus. Ulangi tiap 10 menit jika diperlukan.</div>
              </>
            ) : act >= target ? (
              <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">HCO₃⁻ aktual ({act}) sudah mencapai target ({target}). Tidak perlu koreksi.</div>
            ) : (
              <>
                 <div className="text-sm font-bold text-primary mb-2">Dosis NaHCO₃ — {type1 === 'dka' ? 'DKA' : 'Asidosis Metabolik'}</div>
                 <div className="text-2xl font-black text-primary">{(0.5 * b * (target - act)).toFixed(0)} mEq</div>
                 <div className="text-sm text-[var(--label-primary)] font-medium mt-1">Berikan ½ dosis dulu: <strong className="text-primary">{((0.5 * b * (target - act)) / 2).toFixed(0)} mEq</strong> dalam 4–6 jam, lalu re-evaluasi AGD.</div>
                 <hr className="my-3 border-slate-200 dark:border-slate-700/50" />
                 <div className="text-xs text-[var(--label-secondary)] font-medium leading-relaxed">
                   <strong className="text-[var(--label-primary)]">Sediaan:</strong><br/>
                   • NaHCO₃ 8.4% (1 mEq/mL) → <strong className="text-[var(--label-primary)]">{(0.5 * b * (target - act)).toFixed(0)} mL</strong><br/>
                   • NaHCO₃ 7.5% (0.9 mEq/mL) → <strong className="text-[var(--label-primary)]">{((0.5 * b * (target - act)) / 0.9).toFixed(0)} mL</strong>
                 </div>
                 <div className="text-[11px] font-mono font-medium text-slate-500 mt-2 border-t border-slate-200 dark:border-slate-700/50 pt-2">Rumus: 0.5 × BBI × (target − aktual)</div>
              </>
            )}
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-mono font-bold">📚 Seifter JL. NEJM 2014; Berend K. NEJM 2018</div>
          </div>
        )}
      </div>
    );
  };

  const renderTab2 = () => {
    const b = parseFloat(bb2);
    const act = parseFloat(hco3act2);
    const kal = parseFloat(k);
    const chl = parseFloat(cl);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">BB (kg)</label>
            <input type="number" value={bb2} onChange={e=>setBb2(e.target.value)} className="ios-input w-full" placeholder="e.g. 60" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">HCO₃ Aktual</label>
            <input type="number" value={hco3act2} onChange={e=>setHco3act2(e.target.value)} className="ios-input w-full" placeholder="e.g. 38" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Kalium K⁺</label>
            <input type="number" value={k} onChange={e=>setK(e.target.value)} className="ios-input w-full" placeholder="e.g. 2.8" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Klorida Cl⁻</label>
            <input type="number" value={cl} onChange={e=>setCl(e.target.value)} className="ios-input w-full" placeholder="e.g. 88" />
          </div>
        </div>

        {!isNaN(b) && !isNaN(act) && (
          <div className="space-y-3">
             {act <= 26 ? (
                <div className="p-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-500/20 font-bold rounded-xl">HCO₃⁻ {act} mEq/L ≤ 26. Tidak ada alkalosis metabolik untuk dikoreksi.</div>
             ) : (
                <>
                  {!isNaN(chl) && (
                    <div className={`p-4 border rounded-xl ${chl < 95 ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                       <div className={`font-bold text-sm mb-1 ${chl < 95 ? 'text-amber-700 dark:text-amber-400' : 'text-primary'}`}>{chl < 95 ? '✅ Chloride-Responsive' : '⚡ Chloride-Resistant'}</div>
                       <div className="text-xs font-medium text-[var(--label-secondary)]">{chl < 95 ? 'Kemungkinan penyebab: muntah, NG suction, diuretik. Koreksi dengan NaCl isotonis + KCl.' : 'Kemungkinan penyebab: hiperaldosteronisme, Cushing. Tangani penyebab primer.'}</div>
                    </div>
                  )}

                  {!isNaN(kal) && (
                    <div className={`p-4 border rounded-xl ${kal < 3.5 ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                       <div className="font-bold text-sm mb-2 text-[var(--label-primary)]">Koreksi KCl IV</div>
                       <div className="text-xl font-black text-primary mb-1">{4.0 - kal > 0 ? ((4.0 - kal) * 0.4 * b).toFixed(0) + ' mEq' : 'K⁺ cukup'}</div>
                       {4.0 - kal > 0 && <div className="text-xs font-medium text-[var(--label-secondary)]">Berikan dengan kecepatan ≤20 mEq/jam (perifer) atau ≤40 mEq/jam (sentral).</div>}
                       <div className="text-[11px] font-mono mt-2 text-slate-500">Defisit K⁺ ≈ (4.0 − {kal}) × 0.4 × {b}</div>
                    </div>
                  )}

                  {act >= 40 && (
                     <div className="p-4 border border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10 rounded-xl">
                        <div className="font-bold text-sm text-rose-600 dark:text-rose-400 mb-2">HCl 0.1N — Alkalosis Berat (HCO₃⁻ ≥ 40)</div>
                        <div className="text-xl font-black text-rose-600 dark:text-rose-400 mb-1">{(0.1 * b * (act - 24)).toFixed(0)} mEq HCl</div>
                        <div className="text-xs font-medium text-[var(--label-secondary)] mb-2">Berikan via kateter vena sentral dalam 4–24 jam. Monitor pH tiap 4 jam.<br/>HCl 0.1N = 100 mEq/L → butuh <strong className="text-[var(--label-primary)]">{((0.1 * b * (act - 24)) / 0.1).toFixed(0)} mL</strong>.</div>
                        <div className="text-[11px] font-mono text-slate-500">Rumus: 0.1 × BB × (HCO₃ aktual − 24)</div>
                     </div>
                  )}
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-2 font-mono font-bold ml-1">📚 Gennari FJ. NEJM 1998; Galla JH. JASN 2000</div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="number" value={na4} onChange={e=>setNa4(e.target.value)} placeholder="Na+" className="ios-input w-full" />
          <input type="number" value={cl4} onChange={e=>setCl4(e.target.value)} placeholder="Cl-" className="ios-input w-full" />
          <input type="number" value={hco3act4} onChange={e=>setHco3act4(e.target.value)} placeholder="HCO3-" className="ios-input w-full" />
          <input type="number" value={alb4} onChange={e=>setAlb4(e.target.value)} placeholder="Albumin" className="ios-input w-full" />
        </div>
      );
    }

    const ag = n - (c + h);
    const albCorr = !isNaN(a) ? (a - 4.0) * 2.5 : 0;
    const agCorr = ag - albCorr;
    const agHigh = agCorr > 16;
    
    let ddHtml = null;
    if (agHigh) {
      const dd = (agCorr - 12) / (24 - h);
      ddHtml = (
         <div className="p-4 border border-indigo-200 bg-indigo-50 dark:border-indigo-500/20 dark:bg-indigo-500/10 rounded-xl mt-3">
           <div className="font-bold text-sm mb-1 text-indigo-800 dark:text-indigo-400">Delta-Delta Ratio</div>
           <div className="text-xl font-black text-[var(--label-primary)] mb-1">{dd.toFixed(2)}</div>
           <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
             {dd < 0.4 ? '< 0.4 → NAGMA lebih dominan' : dd <= 0.8 ? '0.4-0.8 → HAGMA + NAGMA campuran' : dd <= 2.0 ? '0.8-2.0 → HAGMA murni' : '> 2.0 → + Alkalosis Metabolik'}
           </div>
         </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Na⁺</label><input type="number" value={na4} onChange={e=>setNa4(e.target.value)} className="ios-input w-full" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Cl⁻</label><input type="number" value={cl4} onChange={e=>setCl4(e.target.value)} className="ios-input w-full" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">HCO₃⁻</label><input type="number" value={hco3act4} onChange={e=>setHco3act4(e.target.value)} className="ios-input w-full" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-[var(--label-secondary)] uppercase tracking-wider">Albumin (opt)</label><input type="number" value={alb4} onChange={e=>setAlb4(e.target.value)} placeholder="4.0" className="ios-input w-full" /></div>
        </div>
        
        <div className={`p-4 border rounded-xl ${agHigh ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
           <div className={`font-bold text-sm mb-1 ${agHigh ? 'text-rose-600 dark:text-rose-400' : 'text-primary'}`}>Anion Gap {isNaN(a) ? '' : '(Terkoreksi)'}</div>
           <div className="text-2xl font-black text-[var(--label-primary)] mb-1">{agCorr.toFixed(1)} mEq/L <span className="text-sm font-bold text-[var(--label-secondary)]">{agHigh ? '↑ HAGMA' : 'Normal'}</span></div>
           <div className="text-[11px] font-mono text-slate-500 font-medium mt-2 border-t border-slate-200 dark:border-slate-700/50 pt-2">
             AG = {n} − ({c} + {h}) = {ag.toFixed(1)} {!isNaN(a) && `| Koreksi alb: ${agCorr.toFixed(1)}`}
           </div>
        </div>
        
        {ddHtml}

        <div className="p-4 border border-slate-200 bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50 rounded-xl">
           <div className="font-bold text-sm mb-1 text-[var(--label-secondary)]">Strong Ion Difference (SID simpel)</div>
           <div className="text-xl font-black text-[var(--label-primary)] mb-1">{(n - c).toFixed(1)} mEq/L</div>
           <div className="text-[11px] font-mono font-medium text-slate-500">SID = Na⁺ − Cl⁻</div>
        </div>
        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold ml-1">📚 Wrenn K. Ann Emerg Med 1990; Stewart PA. Can J Physiol Pharmacol 1983</div>
      </div>
    );
  };

  return (
    <div className="ios-card mt-8">
      <div className="p-4 sm:p-5 border-b border-[var(--glass-border)] bg-[#f8f9fa] dark:bg-transparent">
        <h2 className="text-[15px] font-bold text-[var(--label-primary)] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Kalkulator Koreksi Asam-Basa
        </h2>
        <p className="text-xs font-medium text-[var(--label-secondary)] mt-1">
          Hitung dosis koreksi, formula kompensasi, dan analisis anion gap.
        </p>
      </div>
      <div className="p-0">
        
        <div className="flex border-b border-[var(--glass-border)] overflow-x-auto hide-scrollbar">
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
