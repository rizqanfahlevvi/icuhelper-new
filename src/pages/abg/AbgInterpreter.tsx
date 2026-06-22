import { Activity, Beaker, Dna, Info, CheckCircle2 } from 'lucide-react';
import { AbgInputs } from './types';
import { useAbgCalculator } from './useAbgCalculator';

interface Props {
  inputs: AbgInputs;
  setInputs: (inputs: AbgInputs) => void;
}

export default function AbgInterpreter({ inputs, setInputs }: Props) {
  const updateInput = (key: keyof AbgInputs, val: string) => {
    const newInputs = { ...inputs, [key]: val };
    setInputs(newInputs as AbgInputs);
  };

  const calcResult = useAbgCalculator(inputs);

  return (
    <div className="space-y-6">
      {/* Parameter Dasar Card */}
      <div className="ios-card !mx-0">
        <div className="p-4 sm:p-5 border-b border-[var(--glass-border)] bg-[#f8f9fa] dark:bg-transparent">
          <h2 className="text-sm font-bold text-[var(--label-primary)] flex items-center gap-2">
            <Dna className="w-4 h-4 text-primary" />
            Parameter Dasar ABG
          </h2>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">pH</span>
            <div className="flex-1 relative">
              <input 
                type="number" step="0.01" 
                value={inputs.ph} 
                onChange={e => updateInput('ph', e.target.value)}
                className="w-full pl-3 pr-16 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                placeholder="7.35–7.45" 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">PaCO₂</span>
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="number" 
                  value={inputs.pco2} 
                  onChange={e => updateInput('pco2', e.target.value)}
                  className="w-full pl-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                  placeholder="35–45" 
                />
              </div>
              <button 
                onClick={() => updateInput('paco2Unit', inputs.paco2Unit === 'mmHg' ? 'kPa' : 'mmHg')}
                className="px-4 bg-slate-100 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all w-20 flex-shrink-0"
              >
                {inputs.paco2Unit}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">HCO₃⁻</span>
            <div className="flex-1 relative">
              <input 
                type="number" step="0.1" 
                value={inputs.hco3} 
                onChange={e => updateInput('hco3', e.target.value)}
                className="w-full pl-3 pr-16 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                placeholder="22–26" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                mmol
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">PaO₂</span>
            <div className="flex-1 relative">
              <input 
                type="number" step="1" 
                value={inputs.po2} 
                onChange={e => updateInput('po2', e.target.value)}
                className="w-full pl-3 pr-16 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                placeholder="80–100" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                mmHg
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">BE</span>
            <div className="flex-1 relative">
              <input 
                type="number" step="0.1" 
                value={inputs.be} 
                onChange={e => updateInput('be', e.target.value)}
                className="w-full pl-3 pr-16 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                placeholder="-2 s/d +2" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                mEq/L
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Oksigenasi & Elektrolit Card */}
      <div className="ios-card !mx-0">
        <div className="p-4 sm:p-5 border-b border-[var(--glass-border)] bg-[#f8f9fa] dark:bg-transparent">
          <h2 className="text-sm font-bold text-[var(--label-primary)] flex items-center gap-2">
            <Beaker className="w-4 h-4 text-primary" />
            Oksigenasi, Elektrolit & Klinis
          </h2>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0 sm:mt-3">SpO₂ / SaO₂</span>
            <div className="flex-1 space-y-3">
              <div className="flex p-1 bg-slate-100 dark:bg-[#1C1C1E] rounded-lg border border-slate-200 dark:border-[#38383A]">
                <button 
                  className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.spo2Source === 'pulse' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                  onClick={() => updateInput('spo2Source', 'pulse')}
                >
                  💡 Pulse Ox
                </button>
                <button 
                  className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.spo2Source === 'abg' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                  onClick={() => updateInput('spo2Source', 'abg')}
                >
                  🔬 SaO₂ (ABG)
                </button>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={inputs.spo2} 
                  onChange={e => updateInput('spo2', e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                  placeholder="95-100" 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                  %
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0 sm:mt-3">FiO₂</span>
            <div className="flex-1 space-y-3">
              <div className="flex p-1 bg-slate-100 dark:bg-[#1C1C1E] rounded-lg border border-slate-200 dark:border-[#38383A]">
                <button 
                  className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.fio2Mode === 'direct' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                  onClick={() => updateInput('fio2Mode', 'direct')}
                >
                  🔢 Direct
                </button>
                <button 
                  className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.fio2Mode === 'lowflow' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                  onClick={() => updateInput('fio2Mode', 'lowflow')}
                >
                  💨 Low-Flow
                </button>
              </div>
              {inputs.fio2Mode === 'direct' ? (
                <input 
                  type="number" step="0.01" 
                  value={inputs.fio2Direct} 
                  onChange={e => updateInput('fio2Direct', e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                  placeholder="0.21 - 1.00" 
                />
              ) : (
                <div className="flex gap-2">
                  <select 
                    value={inputs.fio2Device} 
                    onChange={e => updateInput('fio2Device', e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="nasal">Nasal Cannula</option>
                    <option value="simple">Simple Mask</option>
                    <option value="nrm">NRM</option>
                    <option value="venturi24">Venturi 24%</option>
                  </select>
                  <div className="relative w-24">
                    <input 
                      type="number" 
                      value={inputs.fio2Flow} 
                      onChange={e => updateInput('fio2Flow', e.target.value)} 
                      className="w-full pl-2 pr-8 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white text-center outline-none" 
                      placeholder="Flow" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-medium text-slate-400">
                      L/m
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0">Kondisi Utama</span>
            <div className="flex-1">
              <select 
                value={inputs.kondisi} 
                onChange={e => updateInput('kondisi', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="umum">Umum / ICU</option>
                <option value="ards">ARDS</option>
                <option value="copd">PPOK</option>
                <option value="asthma">Asma</option>
                <option value="sepsis">Sepsis</option>
                <option value="cardiac">Edema Paru Kardiogenik</option>
                <option value="postop">Post-Operasi</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
             <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 w-32 flex-shrink-0 mt-2">Param Lainnya</span>
             <div className="flex-[3] grid grid-cols-2 md:grid-cols-4 gap-2">
                <input type="number" placeholder="Na⁺" value={inputs.na} onChange={e=>updateInput('na',e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70"/>
                <input type="number" placeholder="Cl⁻" value={inputs.cl} onChange={e=>updateInput('cl',e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70"/>
                <input type="number" placeholder="Alb" value={inputs.alb} onChange={e=>updateInput('alb',e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70"/>
                <input type="number" placeholder="Lakt" value={inputs.laktat} onChange={e=>updateInput('laktat',e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70"/>
                <input type="number" placeholder="RR" value={inputs.rr} onChange={e=>updateInput('rr',e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70"/>
                <input type="number" placeholder="MAP" value={inputs.mapV} onChange={e=>updateInput('mapV',e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-[#38383A] rounded-xl text-sm font-bold text-slate-900 dark:text-white outline-none placeholder:font-normal placeholder:opacity-70"/>
             </div>
          </div>

        </div>
      </div>

      {calcResult && (
        <div className="ios-result-card mt-6">
          <div className="p-4 sm:p-5 border-b border-[var(--glass-border)]">
            <h3 className="font-extrabold text-[var(--label-primary)] flex items-center gap-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              Hasil Interpretasi ABG
            </h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4">
            {calcResult.step1 && (
              <div className={`p-4 rounded-xl border ${calcResult.step1.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Langkah 1 — Status pH</div>
                <div className="font-extrabold text-sm text-[var(--label-primary)]">{calcResult.step1.status}</div>
                <div className="text-xs opacity-90 mt-1">{calcResult.step1.detail}</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calcResult.step2Primer && (
                <div className={`p-4 rounded-xl border ${calcResult.step2Primer.cls}`}>
                  <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Langkah 2 — Gangguan Primer</div>
                  <div className="font-extrabold text-sm text-[var(--label-primary)]">{calcResult.step2Primer.interp}</div>
                </div>
              )}

              {calcResult.step2KompStatus && (
                <div className={`p-4 rounded-xl border ${calcResult.step2KompStatus.cls}`}>
                  <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Status Kompensasi</div>
                  <div className="font-bold text-sm text-[var(--label-primary)]">{calcResult.step2KompStatus.interp}</div>
                </div>
              )}
            </div>

            {calcResult.step3Kompensasi && (
              <div className={`p-4 rounded-xl border ${calcResult.step3Kompensasi.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Langkah 3 — Evaluasi Kompensasi</div>
                <div className="font-medium text-sm text-[var(--label-primary)]">{calcResult.step3Kompensasi.detail}</div>
              </div>
            )}

            {calcResult.step4Ag && (
              <div className={`p-4 rounded-xl border ${calcResult.step4Ag.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Langkah 4 — Anion Gap</div>
                <div className="font-bold text-sm text-[var(--label-primary)]">{calcResult.step4Ag.interp}</div>
                {calcResult.step4Ag.ddNote && <div className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-2">{calcResult.step4Ag.ddNote}</div>}
                {calcResult.step4Ag.detail && <div className="text-xs opacity-90 mt-1">{calcResult.step4Ag.detail}</div>}
              </div>
            )}

            {calcResult.step5Laktat && (
              <div className={`p-4 rounded-xl border ${calcResult.step5Laktat.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Langkah 5 — Laktat</div>
                <div className="font-bold text-sm text-[var(--label-primary)]">{calcResult.step5Laktat.interp}</div>
                {calcResult.step5Laktat.detail && <div className="text-xs opacity-90 mt-1">{calcResult.step5Laktat.detail}</div>}
              </div>
            )}

            {calcResult.step6Oksigenasi && (
              <div className={`p-4 rounded-xl border ${calcResult.step6Oksigenasi.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#007AFF] dark:text-[#0A84FF] opacity-90 mb-1">Langkah 6 — Oksigenasi & Gagal Napas</div>
                <div className="text-sm font-medium leading-relaxed text-[var(--label-primary)]" dangerouslySetInnerHTML={{__html: calcResult.step6Oksigenasi.html}} />
              </div>
            )}

            {calcResult.saran.length > 0 && (
              <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 text-foreground">
                <div className="text-[11px] font-bold uppercase tracking-widest text-primary opacity-90 mb-2">Konsiderasi Klinis & Saran Ventilator</div>
                <ul className="list-disc pl-5 space-y-1">
                  {calcResult.saran.map((s, idx) => (
                    <li key={idx} className="text-[13px] font-medium text-[var(--label-secondary)]">{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {calcResult.mgmt.length > 0 && (
              <div className="p-4 rounded-xl border bg-card border-border mt-4 space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-widest mb-3">Langkah 7 — Tatalaksana Asam-Basa</div>
                {calcResult.mgmt.map((m, idx) => (
                  <div key={idx} className="pb-3 border-b border-border/50 last:border-0 last:pb-0">
                    <div className={`font-bold text-sm mb-2 ${m.color}`}>🎯 {m.judul}</div>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      {m.isi.map((k, i) => <li key={i} className="text-xs text-[var(--label-secondary)] font-medium">{k}</li>)}
                    </ul>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 opacity-90 font-mono">📚 {m.ref}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-start gap-2 mt-4 p-3 bg-amber-500/10 rounded-xl text-[11px] text-amber-800 dark:text-amber-200 border border-amber-500/20">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
              <p><strong>⚠ Disclaimer Klinis:</strong> Interpretasi ABG ini adalah panduan sistematis berbasis algoritma standar. Keputusan klinis tetap berdasarkan kondisi pasien secara keseluruhan dan kebijakan institusi.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

