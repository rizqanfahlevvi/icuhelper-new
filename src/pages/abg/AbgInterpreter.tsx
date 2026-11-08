import { Beaker, Dna, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { kpaFromMmHg, mmHgFromKpa } from '../../utils/clinicalUnits';
import { AgUpperNormalField } from '../../components/ui/AgUpperNormalField';
import { SUPPORT_LABEL, RespSupport } from '../../utils/oxygenation';
import { CalcSteps } from '../../components/ui/CalcSteps';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import type { AbgResultData } from './abgInterpretation';

/** Ringkasan satu baris untuk riwayat. */
function historySummary(inputs: AbgInputs, r: AbgResultData): string {
  const parts = [
    `${r.isVbg ? 'VBG' : 'ABG'} pH ${inputs.ph} · ${r.isVbg ? 'PvCO₂' : 'PaCO₂'} ${inputs.pco2} ${inputs.paco2Unit} · HCO₃ ${inputs.hco3}`,
    r.analysis?.primaryText ?? '',
    r.analysis?.compNote.text ?? '',
    r.step4Ag ? r.step4Ag.interp : '',
    r.respFailure && r.respFailure.type !== 'tidak-dinilai' ? r.respFailure.title : '',
  ];
  const pf = r.step6Oksigenasi?.items.find(i => i.label === 'P/F Ratio');
  if (pf) parts.push(`P/F ${pf.value}`);
  return parts.filter(Boolean).join(' · ');
}
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

  // Ganti satuan tekanan gas → angka yang sudah diisi IKUT dikonversi (bukan ditafsir ulang:
  // PaO₂ 70 mmHg tidak boleh mendadak dibaca 70 kPa = 525 mmHg).
  const togglePressureUnit = () => {
    const toKpa = inputs.paco2Unit === 'mmHg';
    const conv = (v: string) => (v.trim() === '' ? v : toKpa ? kpaFromMmHg(v) : mmHgFromKpa(v));
    setInputs({ ...inputs, paco2Unit: toKpa ? 'kPa' : 'mmHg', pco2: conv(inputs.pco2), po2: conv(inputs.po2) });
  };

  const calcResult = useAbgCalculator(inputs);
  const effectiveSupport: RespSupport = inputs.fio2Mode === 'lowflow' ? 'udara' : inputs.support;

  return (
    <div className="space-y-6">
      {/* Parameter Dasar Card */}
      <div className="flex flex-col gap-0 mt-2">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Dna className="w-4 h-4 text-primary" />
          Parameter Dasar ABG
        </h2>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-200 dark:divide-slate-700 w-full shadow-sm">
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Jenis Sampel</span>
              <div className="flex bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg">
                <button
                  className={`px-3 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.sampleType !== 'vena' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                  onClick={() => updateInput('sampleType', 'arteri')}
                >
                  🩸 Arteri (ABG)
                </button>
                <button
                  className={`px-3 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.sampleType === 'vena' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                  onClick={() => updateInput('sampleType', 'vena')}
                >
                  💧 Vena (VBG)
                </button>
              </div>
            </div>
            {inputs.sampleType === 'vena' && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400">VBG: pH dikonversi (pH arteri ≈ pH vena + 0,03). PCO₂ vena hanya perkiraan; PO₂ vena tidak dipakai (Byrne 2014).</p>
            )}
          </div>

          
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">pH</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="0.01" 
                value={inputs.ph} 
                onChange={e => updateInput('ph', e.target.value)}
                className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                placeholder="7.35–7.45" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{inputs.sampleType === 'vena' ? 'PvCO₂' : 'PaCO₂'}</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" 
                value={inputs.pco2} 
                onChange={e => updateInput('pco2', e.target.value)}
                className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                placeholder="35–45" 
              />
              <button 
                onClick={togglePressureUnit}
                className="px-2 py-2 bg-slate-200 dark:bg-[#38383A] rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all w-14 flex-shrink-0"
              >
                {inputs.paco2Unit}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">HCO₃⁻</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="0.1" 
                value={inputs.hco3} 
                onChange={e => updateInput('hco3', e.target.value)}
                className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                placeholder="22–26" 
              />
              <span className="text-[11px] font-semibold text-slate-500 w-8 text-left">mmol</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{inputs.sampleType === 'vena' ? 'PvO₂ (diabaikan)' : 'PaO₂'}</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="1" 
                value={inputs.po2} 
                onChange={e => updateInput('po2', e.target.value)}
                className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                placeholder="80–100" 
              />
              <button
                onClick={togglePressureUnit}
                className="px-2 py-2 bg-slate-200 dark:bg-[#38383A] rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all w-14 flex-shrink-0"
                title="Satuan gas (berlaku untuk PaCO₂ & PaO₂)"
              >
                {inputs.paco2Unit}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">BE</span>
            <div className="flex-1 flex items-center justify-end gap-2">
              <input 
                type="number" step="0.1" 
                value={inputs.be} 
                onChange={e => updateInput('be', e.target.value)}
                className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                placeholder="-2 s/d +2" 
              />
              <span className="text-[11px] font-semibold text-slate-500 w-8 text-left">mEq</span>
            </div>
          </div>
        </div>
      </div>

      {/* Oksigenasi & Elektrolit Card */}
      <div className="flex flex-col gap-0 mt-6">
        <h2 className="mb-2 px-4 text-[13px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-2">
          <Beaker className="w-4 h-4 text-primary" />
          Oksigenasi, Elektrolit & Klinis
        </h2>
        
        <div className="bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-200 dark:divide-slate-700 w-full shadow-sm">
          
          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Saturasi O₂</span>
              <div className="flex-1 flex items-center justify-end gap-2">
                <input 
                  type="number" step="1" 
                  value={inputs.spo2} 
                  onChange={e => updateInput('spo2', e.target.value)}
                  className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                  placeholder="95-100" 
                />
                <span className="text-[11px] font-semibold text-slate-500 w-4 text-left">%</span>
              </div>
            </div>
            <div className="flex bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg">
              <button 
                className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.spo2Source === 'abg' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                onClick={() => updateInput('spo2Source', 'abg')}
              >
                🔬 SaO₂ (ABG)
              </button>
              <button 
                className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.spo2Source === 'pulse' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                onClick={() => updateInput('spo2Source', 'pulse')}
              >
                💡 Pulse Ox
              </button>
            </div>
          </div>

          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">FiO₂</span>
              <div className="flex bg-slate-200 dark:bg-[#1C1C1E] p-1 rounded-lg">
                <button 
                  className={`px-3 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.fio2Mode === 'direct' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                  onClick={() => updateInput('fio2Mode', 'direct')}
                >
                  🔢 Direct
                </button>
                <button 
                  className={`px-3 text-xs py-1.5 rounded-md font-bold transition-colors ${inputs.fio2Mode === 'lowflow' ? 'bg-white dark:bg-[#2C2C2E] shadow-sm text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`} 
                  onClick={() => updateInput('fio2Mode', 'lowflow')}
                >
                  💨 Low-Flow
                </button>
              </div>
            </div>
            
            {inputs.fio2Mode === 'direct' ? (
              <div className="flex items-center justify-end gap-2 mt-2">
                <span className="text-[11px] text-slate-500">fraksi, atau persen 21–100</span>
                <input 
                  type="number" step="0.01" 
                  value={inputs.fio2Direct} 
                  onChange={e => updateInput('fio2Direct', e.target.value)}
                  className="w-28 flex-shrink-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px] transition-all" 
                  placeholder="0.21–1.0" 
                />
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <select 
                  value={inputs.fio2Device} 
                  onChange={e => updateInput('fio2Device', e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg text-sm font-bold text-slate-900 dark:text-white outline-none"
                >
                  <option value="nasal">Nasal Cannula</option>
                  <option value="simple">Simple Mask</option>
                  <option value="nrm">NRM</option>
                  <option value="venturi24">Venturi 24%</option>
                </select>
                <div className="flex items-center gap-1 w-24">
                  <input 
                    type="number" 
                    value={inputs.fio2Flow} 
                    onChange={e => updateInput('fio2Flow', e.target.value)} 
                    className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2 py-2 outline-none text-right font-bold text-slate-900 dark:text-white text-[14px]" 
                    placeholder="Flow" 
                  />
                  <span className="text-[11px] font-semibold text-slate-500">L/m</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col px-4 py-3 gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Dukungan Napas</span>
              <select
                value={effectiveSupport}
                disabled={inputs.fio2Mode === 'lowflow'}
                onChange={e => updateInput('support', e.target.value)}
                className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all w-full max-w-[220px] appearance-none disabled:opacity-60"
              >
                {(Object.keys(SUPPORT_LABEL) as RespSupport[]).map(k => <option key={k} value={k}>{SUPPORT_LABEL[k]}</option>)}
              </select>
            </div>
            {inputs.fio2Mode === 'lowflow' && (
              <p className="text-[11px] text-slate-500">Mode low-flow → dukungan napas dianggap O₂ low-flow.</p>
            )}
            {effectiveSupport === 'hfno' && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">Flow</span>
                <input type="number" value={inputs.hfnoFlow} onChange={e => updateInput('hfnoFlow', e.target.value)} className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px]" placeholder="L/m" />
                <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">Jam ke-</span>
                <select value={inputs.roxHour} onChange={e => updateInput('roxHour', e.target.value)} className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white text-[13px]">
                  <option value="">—</option>
                  <option value="2">2</option>
                  <option value="6">6</option>
                  <option value="12">12</option>
                </select>
              </div>
            )}
            {(effectiveSupport === 'niv' || effectiveSupport === 'invasif') && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400">PEEP/EPAP</span>
                <input type="number" value={inputs.peep} onChange={e => updateInput('peep', e.target.value)} className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px]" placeholder="cmH₂O" />
                <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-400" title="Mean airway pressure dari ventilator — bukan MAP arteri">Paw</span>
                <input type="number" value={inputs.mapV} onChange={e => updateInput('mapV', e.target.value)} className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[14px]" placeholder="cmH₂O" />
              </div>
            )}
            {(effectiveSupport === 'niv' || effectiveSupport === 'invasif') && (
              <p className="text-[11px] text-slate-500 text-right">Paw = tekanan jalan napas rerata dari ventilator (untuk OI) — bukan MAP arteri.</p>
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-3 gap-4">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Kondisi Utama</span>
            <select 
              value={inputs.kondisi} 
              onChange={e => updateInput('kondisi', e.target.value)}
              className="bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all w-full max-w-[200px] appearance-none"
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

          <div className="flex flex-col px-4 py-3 gap-2">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 block">Param Lainnya</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               <input type="number" placeholder="Na⁺" value={inputs.na} onChange={e=>updateInput('na',e.target.value)} className="w-full min-w-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-center font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all"/>
               <input type="number" placeholder="Cl⁻" value={inputs.cl} onChange={e=>updateInput('cl',e.target.value)} className="w-full min-w-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-center font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all"/>
               <input type="number" placeholder="Alb" value={inputs.alb} onChange={e=>updateInput('alb',e.target.value)} className="w-full min-w-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-center font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all"/>
               <input type="number" placeholder="Lakt" value={inputs.laktat} onChange={e=>updateInput('laktat',e.target.value)} className="w-full min-w-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-center font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all"/>
               <input type="number" placeholder="RR" value={inputs.rr} onChange={e=>updateInput('rr',e.target.value)} className="w-full min-w-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-center font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all"/>
               <input type="number" placeholder="Usia (th)" value={inputs.age} onChange={e=>updateInput('age',e.target.value)} className="w-full min-w-0 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none text-center font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/50 text-[13px] transition-all"/>
            </div>
            <div className="pt-2 mt-1 border-t border-slate-200 dark:border-slate-700">
              <AgUpperNormalField />
            </div>
          </div>
        </div>
      </div>

      {calcResult && (
        <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm mt-6">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-[var(--label-primary)] flex items-center gap-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
              Hasil Interpretasi ABG
            </h3>
          </div>
          
          <div className="p-4 sm:p-5 space-y-4">
            {calcResult.inputError && (
              <div className="p-4 rounded-xl border bg-destructive/10 border-destructive/30 text-destructive flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="text-[13px] font-bold">{calcResult.inputError}</div>
              </div>
            )}

            {calcResult.warnings.length > 0 && (
              <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Periksa Input</div>
                <ul className="list-disc pl-5 space-y-1">
                  {calcResult.warnings.map((w, i) => <li key={i} className="text-[12px] font-medium">{w}</li>)}
                </ul>
              </div>
            )}

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
                  {calcResult.step2Primer.notes.length > 0 && (
                    <ul className="mt-2 space-y-1 list-disc pl-4">
                      {calcResult.step2Primer.notes.map((n, i) => <li key={i} className="text-[12px] text-amber-600 dark:text-amber-400 font-medium">{n}</li>)}
                    </ul>
                  )}
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

            {calcResult.respFailure && (
              <div className={`p-4 rounded-xl border ${calcResult.respFailure.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Langkah 6 — Kategori Gagal Napas</div>
                <div className="font-extrabold text-sm text-[var(--label-primary)]">{calcResult.respFailure.title}</div>
                <ul className="mt-1.5 space-y-1 list-disc pl-4">
                  {calcResult.respFailure.details.map((d, i) => <li key={i} className="text-[12px] opacity-90">{d}</li>)}
                </ul>
              </div>
            )}

            {calcResult.step6Oksigenasi && (
              <div className={`p-4 rounded-xl border ${calcResult.step6Oksigenasi.cls}`}>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--sys-blue)] opacity-90 mb-2">Langkah 6b — Oksigenasi</div>
                <div className="space-y-2">
                  {calcResult.step6Oksigenasi.items.map((item, idx) => (
                    <div key={idx} className="text-[13px] leading-relaxed">
                      <span className="font-semibold">{item.label} = {item.value}</span>
                      {' → '}
                      <span className={`font-bold ${item.colorClass}`}>{item.interp}</span>
                    </div>
                  ))}
                </div>
                {calcResult.step6Oksigenasi.notes.length > 0 && (
                  <ul className="mt-3 pt-2 border-t border-primary/20 space-y-1 list-disc pl-4">
                    {calcResult.step6Oksigenasi.notes.map((n, i) => <li key={i} className="text-[12px] text-[var(--label-secondary)]">{n}</li>)}
                  </ul>
                )}
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

            {calcResult.calcSteps.length > 0 && (
              <CalcSteps
                steps={calcResult.calcSteps}
                footer={`Rumus dengan angka pasien ini — interpretasikan bersama klinis.${calcResult.isVbg ? ' Sampel VBG: komponen respiratorik hanya perkiraan.' : ''}`}
              />
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
            
            {calcResult.analysis && (
              <SaveToHistoryButton
                module="abg"
                label={`${calcResult.isVbg ? 'VBG' : 'ABG'}: ${calcResult.analysis.primaryText}`.slice(0, 120)}
                inputs={{ ...inputs }}
                summary={historySummary(inputs, calcResult)}
                className="w-full"
              />
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

