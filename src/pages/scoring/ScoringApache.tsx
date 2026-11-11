import React, { useState, useMemo } from 'react';
import { computeApache, apacheMortalityNonop, APACHE_MORTALITY_NONOP } from '../../utils/apache';
import { Activity, Stethoscope } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { CalcActionBar } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import { toneFromColorClass } from '../../utils/barTone';
import { fio2ToPercentString, fio2FromStoreString } from '../../utils/abg';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { DecimalInput } from '../../components/ui/DecimalInput';

export default function ScoringApache() {
  const [age, setAge] = useState('');
  const [chronicType, setChronicType] = useState('nonop');
  const [hasChronic, setHasChronic] = useState('no');
  
  const [temp, setTemp] = useState('');
  const [map, setMap] = useState('');
  const [hr, setHr] = useState('');
  const [rr, setRr] = useState('');
  const [gcs, setGcs] = useState('');
  
  const [fio2, setFio2] = useState('');
  const [pao2, setPao2] = useState('');
  const [paco2, setPaco2] = useState('');
  const [ph, setPh] = useState('');
  
  const [na, setNa] = useState('');
  const [k, setK] = useState('');
  const [cr, setCr] = useState('');
  const [aki, setAki] = useState('no');
  const [hct, setHct] = useState('');
  const [wbc, setWbc] = useState('');

  const calculateScore = () => {
    const num = (v: string) => (v.trim() === '' ? undefined : parseFloat(v));
    const r = computeApache({
      temp: num(temp), map: num(map), hr: num(hr), rr: num(rr),
      fio2: num(fio2), pao2: num(pao2), paco2: num(paco2), ph: num(ph),
      na: num(na), k: num(k), cr: num(cr), aki: aki === 'yes',
      hct: num(hct), wbc: num(wbc), gcs: num(gcs), age: num(age),
      chronic: hasChronic === 'yes' ? (chronicType as 'nonop' | 'emergency' | 'elective') : 'none',
    });
    const band = apacheMortalityNonop(r.total);
    return {
      total: r.total, aps: r.aps, ageScore: r.agePts, chronScore: r.chronicPts,
      breakdown: r.breakdown, filled: r.filled, missing: r.missing, notes: r.notes,
      mort: band.mortality, complete: r.filled === 12,
    };
  };

  const result = calculateScore();
  const totalColor = result.total > 15 ? 'text-red-500' : 'text-cyan-500';

  // Hitung sekali → hasil tampil & selalu mengikuti input (dihitung ulang tiap render).
  const calc = useCalcTrigger({
    compute: () => {},
    deps: [],
    required: [{ id: 'apache-age', label: 'Usia', filled: age.trim() !== '' }],
  });

  const syncFields = useMemo(() => {
    return [
      { key: 'age' as const, label: 'Usia', value: age, setter: setAge, unit: 'tahun' },
      { key: 'temp' as const, label: 'Suhu', value: temp, setter: setTemp, unit: '°C' },
      { key: 'map' as const, label: 'MAP', value: map, setter: setMap, unit: 'mmHg' },
      { key: 'hr' as const, label: 'HR', value: hr, setter: setHr, unit: 'x/menit' },
      { key: 'rr' as const, label: 'RR', value: rr, setter: setRr, unit: 'x/menit' },
      // Clinical store menyimpan FiO₂ dalam PERSEN; APACHE memakai fraksi → konversi dua arah.
      { key: 'fio2' as const, label: 'FiO2', value: fio2ToPercentString(fio2), rawValue: fio2, setter: (val: string) => setFio2(fio2FromStoreString(val)), unit: '%' },
      { key: 'pao2' as const, label: 'PaO2', value: pao2, setter: setPao2, unit: 'mmHg' },
      { key: 'pco2' as const, label: 'PaCO2', value: paco2, setter: setPaco2, unit: 'mmHg' },
      { key: 'ph' as const, label: 'pH', value: ph, setter: setPh, unit: '' },
      { key: 'na' as const, label: 'Natrium', value: na, setter: setNa, unit: 'mEq/L' },
      { key: 'k' as const, label: 'Kalium', value: k, setter: setK, unit: 'mEq/L' },
      { key: 'creatinine' as const, label: 'Kreatinin', value: cr, setter: setCr, unit: 'mg/dL' },
      { key: 'leukosit' as const, label: 'WBC', value: wbc, setter: setWbc, unit: '10³/µL' },
      { key: 'hematokrit' as const, label: 'Ht', value: hct, setter: setHct, unit: '%' },
      { key: 'gcs' as const, label: 'GCS', value: gcs, setter: setGcs, unit: '' },
    ];
  }, [age, temp, map, hr, rr, fio2, pao2, paco2, ph, na, k, cr, wbc, hct, gcs]);

  const handleAutofill = (data: any) => {
    if (data.age && typeof setAge !== 'undefined') setAge(data.age);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Unified Clinical Synchronization Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Stethoscope className="w-5 h-5 text-cyan-500" />
               APACHE-II Score
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Acute Physiology and Chronic Health Evaluation</p>
           </div>
         </div>

         <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 p-3 rounded-lg text-sm mb-4 md:mb-6">
            <strong>📌 Catatan:</strong> Gunakan nilai <strong>terburuk</strong> dalam 24 jam pertama masuk ICU. Parameter yang tidak diukur dihitung 0 poin (dianggap normal), sehingga skor bisa lebih rendah dari sebenarnya — kelengkapan ditampilkan di hasil.
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-sm text-cyan-500 uppercase tracking-wider">📋 Data Umum</h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Usia (tahun)</label>
                  <DecimalInput aria-label="Usia (tahun)" id="apache-age" inputMode="numeric" value={age} onChange={e => setAge(e.target.value)} className={`min-h-[44px] ${calc.isMissing('apache-age') ? 'ring-2 ring-[var(--sys-red)] ' : ''}w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all`} placeholder="Cth: 65" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipe masuk ICU</label>
                  <select aria-label="Tipe masuk ICU" value={chronicType} onChange={e => setChronicType(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]">
                    <option value="nonop">Non-operatif / Medis</option>
                    <option value="emergency">Post-op Emergency</option>
                    <option value="elective">Post-op Elektif</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Komorbiditas Berat (Chronic Health)</label>
                  <div className="text-[11px] text-muted-foreground mb-2">Sirosis hati, NYHA IV, PPOK berat, dialisis kronik, imunosupresi, dll.</div>
                  <select aria-label="Komorbiditas berat (chronic health)" value={hasChronic} onChange={e => setHasChronic(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]">
                    <option value="no">Tidak ada</option>
                    <option value="yes">Ada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-sm text-cyan-500 uppercase tracking-wider">🌡️ Vital Signs (Terburuk 24 Jam)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Suhu Rektal (°C)</label>
                    <DecimalInput aria-label="Suhu Rektal (°C)" value={temp} onChange={e => setTemp(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">MAP (mmHg)</label>
                    <DecimalInput aria-label="MAP (mmHg)" value={map} onChange={e => setMap(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nadi (bpm)</label>
                    <DecimalInput aria-label="Nadi (bpm)" value={hr} onChange={e => setHr(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">RR (/mnt)</label>
                    <DecimalInput aria-label="RR (/mnt)" value={rr} onChange={e => setRr(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">GCS Total (3-15)</label>
                    <DecimalInput aria-label="GCS Total (3-15)" value={gcs} onChange={e => setGcs(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-sm text-cyan-500 uppercase tracking-wider">🫁 Oksigenasi & AGD</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">FiO₂</label>
                    <DecimalInput aria-label="FiO₂" step="0.01" value={fio2} onChange={e => setFio2(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="0.21 - 1.0 (Opsional)" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">PaO₂ (mmHg)</label>
                    <DecimalInput aria-label="PaO₂ (mmHg)" value={pao2} onChange={e => setPao2(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">PaCO₂ (mmHg)</label>
                    <DecimalInput aria-label="PaCO₂ (mmHg)" value={paco2} onChange={e => setPaco2(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Bila FiO2 ≥ 0.5" />
                  </div>
                  <div className="col-span-2">
                     <label className="text-sm font-medium mb-1 block">pH Arteri</label>
                     <DecimalInput aria-label="pH Arteri" step="0.01" value={ph} onChange={e => setPh(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-sm text-cyan-500 uppercase tracking-wider">🩸 Laboratorium</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Natrium (mEq/L)</label>
                    <DecimalInput aria-label="Natrium (mEq/L)" value={na} onChange={e => setNa(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Kalium (mEq/L)</label>
                    <DecimalInput aria-label="Kalium (mEq/L)" step="0.1" value={k} onChange={e => setK(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Kreatinin (mg/dL)</label>
                    <DecimalInput aria-label="Kreatinin (mg/dL)" step="0.1" value={cr} onChange={e => setCr(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gagal Ginjal Akut?</label>
                    <select aria-label="Gagal Ginjal Akut?" value={aki} onChange={e => setAki(e.target.value)} className="w-full p-2 border rounded-lg bg-background text-sm min-h-[44px]">
                      <option value="no">Tidak / Stabil</option>
                      <option value="yes">Ya (Skor Cr x2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hematokrit (%)</label>
                    <DecimalInput aria-label="Hematokrit (%)" step="0.1" value={hct} onChange={e => setHct(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Leukosit (×10³/mm³)</label>
                    <DecimalInput aria-label="Leukosit (×10³/mm³)" step="0.1" value={wbc} onChange={e => setWbc(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all min-h-[44px]" placeholder="Opsional" />
                  </div>
                </div>
              </div>
            </div>
         </div>

         {calc.armed && calc.missing.length === 0 && (
         <div id="apache-hasil" className="scroll-mt-4 mt-8 bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center px-2">
              <div className="text-center md:text-left">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">APACHE-II SCORE TOTAL</div>
                <div className={`text-5xl font-black ${totalColor}`}>{result.total}</div>
                <div className="text-sm font-medium mt-2">
                   Mortalitas RS (non-operatif, Knaus 1985): <span className="text-foreground font-bold">{result.mort}</span>
                </div>
                <div className={`text-xs mt-1 font-semibold ${result.complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {result.filled}/12 parameter fisiologis terisi{result.complete ? '' : ' — skor minimal (parameter kosong dihitung 0)'}
                </div>
                {chronicType !== 'nonop' && (
                  <div className="text-[11px] text-muted-foreground mt-1">Pasien pasca-bedah: mortalitas umumnya lebih rendah daripada angka non-operatif ini.</div>
                )}
              </div>
              <div className="bg-slate-50 dark:bg-[var(--dk-surface-2)]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 w-full md:w-auto text-sm space-y-1">
                 <div className="flex justify-between gap-8">
                   <span className="text-muted-foreground">APS (12 Variabel):</span>
                   <span className="font-bold">{result.aps}</span>
                 </div>
                 <div className="flex justify-between gap-8">
                   <span className="text-muted-foreground">Skor Usia:</span>
                   <span className="font-bold">{result.ageScore}</span>
                 </div>
                 <div className="flex justify-between gap-8">
                   <span className="text-muted-foreground">Skor Komorbiditas:</span>
                   <span className="font-bold">{result.chronScore}</span>
                 </div>
                 
                 <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                    <SaveToHistoryButton 
                      module="scoring_apache" 
                      label={`APACHE-II: ${result.total}`}
                      inputs={{ age, chronicType, hasChronic, temp, map, hr, rr, gcs, fio2, pao2, paco2, ph, na, k, cr, aki, hct, wbc }}
                      summary={`Skor Total: ${result.total} (${result.filled}/12 parameter; mortalitas RS non-operatif ${result.mort})`}
                      className="w-full"
                    />
                 </div>
              </div>
            </div>

            {result.breakdown.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[13px] font-bold text-cyan-600 dark:text-cyan-400 mb-3">🧮 Rincian Kontribusi Poin</div>
                <div className="space-y-1">
                  {result.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-[13px] px-3 py-2 rounded-lg bg-slate-50 dark:bg-[var(--dk-surface-2)]/40 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-700 dark:text-slate-300">{b.label} <span className="text-slate-400 font-mono">({b.value})</span></span>
                      <span className={`font-bold font-mono ${b.pts === 0 ? 'text-slate-400' : b.pts >= 3 ? 'text-red-500' : 'text-amber-500'}`}>+{b.pts}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-[13px] px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 font-bold">
                    <span className="text-cyan-700 dark:text-cyan-300">Total (APS {result.aps} + Usia {result.ageScore} + Kronik {result.chronScore})</span>
                    <span className="font-mono text-cyan-700 dark:text-cyan-300">{result.total}</span>
                  </div>
                </div>
                <p className="text-[11px] italic text-slate-500 mt-2">Parameter kosong diberi 0 poin (dianggap normal) sesuai konvensi APACHE II. Gunakan nilai terburuk dalam 24 jam pertama.</p>
              </div>
            )}

            {(result.missing.length > 0 || result.notes.length > 0) && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[13px] space-y-1">
                {result.missing.length > 0 && (
                  <div><strong>Belum diisi:</strong> {result.missing.join(' · ')}</div>
                )}
                {result.notes.map((n, i) => <div key={i}>• {n}</div>)}
              </div>
            )}
         </div>
         )}
      </div>

      <Accordion title="📖 Teori APACHE-II Score (Knaus et al. 1985)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> APACHE-II (1985) adalah sistem penilaian keparahan penyakit ICU yang banyak digunakan secara historis. Diperuntukkan untuk prediksi mortalitas populasi, *bukan* keputusan individual.</li>
          <li><strong className="text-foreground">Keterbatasan:</strong> Dikembangkan dari data 1979–1982; kalibrasinya bergeser pada populasi ICU modern sehingga angka mortalitas hanya gambaran kasar. Tabel di bawah adalah mortalitas <em>rumah sakit</em> menurut rentang skor (kolom non-operatif) tanpa bobot kategori diagnosis yang dipakai persamaan aslinya.</li>
          <li><strong className="text-foreground">Rekomendasi Praktis:</strong> Untuk pemantauan harian disfungsi organ gunakan SOFA. Pada pasien ICU dengan dugaan infeksi, SOFA lebih akurat secara prognostik dibanding SIRS dan qSOFA (Raith EP et al. 2017).</li>
        </ul>
        <div className="mt-3 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
              <tr><th className="px-3 py-2 font-semibold">APACHE II</th><th className="px-3 py-2 font-semibold">Mortalitas RS — non-operatif</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {APACHE_MORTALITY_NONOP.map((b) => (
                <tr key={b.range}><td className="px-3 py-1.5 font-medium">{b.range}</td><td className="px-3 py-1.5">{b.mortality}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="p-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">Rentang 30–34: sumber sekunder menyebut 73% atau 75%. Pasien pasca-bedah umumnya lebih rendah (kolom pasca-bedah tidak ditampilkan karena belum dapat diverifikasi ke naskah asli).</div>
        </div>
        <div className="mt-4 p-4 bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Knaus WA et al. (APACHE-II original) Crit Care Med 1985;13:818 · Zimmerman JE et al. (APACHE-IV validasi) Crit Care Med 2006;34:1297 · Raith EP et al. (SOFA lebih baik dari APACHE-II era Sepsis-3) JAMA 2017;317:290
        </div>
      </Accordion>
      <CalcActionBar
        armed={calc.armed}
        onCalculate={calc.trigger}
        label="Hitung APACHE II"
        summary={calc.missing.length === 0 ? `APACHE II ${result.total} · mortalitas RS ${result.mort}` : null}
        summaryTone={toneFromColorClass(totalColor)}
        caption={`${result.filled}/12 parameter fisiologis${result.complete ? '' : ' — skor minimal'} · non-operatif (Knaus 1985)`}
        missing={calc.missing}
        resultTargetId="apache-hasil"
      />
      <AbbrLegend
        terms={[
          'APACHE', 'APS', 'ICU', 'NYHA', 'PPOK', 'MAP', 'HR', 'RR', 'GCS', 'FiO2', 'PaO2', 'PaCO2', 'AGD', 'A-a',
          'Cr', 'Ht', 'WBC', 'RS', 'SOFA', 'SIRS', 'qSOFA',
        ]}
      />
    </div>
  );
}
