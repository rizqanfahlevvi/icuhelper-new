import React, { useState, useMemo } from 'react';
import { Activity, Stethoscope } from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';

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
    let aps = 0;

    // 1. Temp
    const t = parseFloat(temp);
    if (!isNaN(t)) {
      if (t >= 41) aps += 4;
      else if (t >= 39) aps += 3;
      else if (t >= 38.5) aps += 1;
      else if (t >= 36) aps += 0;
      else if (t >= 34) aps += 1;
      else if (t >= 32) aps += 2;
      else if (t >= 30) aps += 3;
      else aps += 4;
    }

    // 2. MAP
    const m = parseFloat(map);
    if (!isNaN(m)) {
      if (m >= 160) aps += 4;
      else if (m >= 130) aps += 3;
      else if (m >= 110) aps += 2;
      else if (m >= 70) aps += 0;
      else if (m >= 50) aps += 2;
      else aps += 4;
    }

    // 3. HR
    const h = parseFloat(hr);
    if (!isNaN(h)) {
      if (h >= 180) aps += 4;
      else if (h >= 140) aps += 3;
      else if (h >= 110) aps += 2;
      else if (h >= 70) aps += 0;
      else if (h >= 55) aps += 2;
      else if (h >= 40) aps += 3;
      else aps += 4;
    }

    // 4. RR
    const r = parseFloat(rr);
    if (!isNaN(r)) {
      if (r >= 50) aps += 4;
      else if (r >= 35) aps += 3;
      else if (r >= 25) aps += 1;
      else if (r >= 12) aps += 0;
      else if (r >= 10) aps += 1;
      else if (r >= 6) aps += 2;
      else aps += 4;
    }

    // 5. Oxygenation
    const f = isNaN(parseFloat(fio2)) ? 0.21 : parseFloat(fio2);
    const pa2 = parseFloat(pao2);
    const pco2 = parseFloat(paco2);
    if (!isNaN(pa2)) {
      let fNum = f > 1 ? f / 100 : f; // adapt percentage
      if (fNum >= 0.5) {
        if (!isNaN(pco2)) {
          const aaDO2 = (fNum * (760 - 47)) - (pco2 / 0.8) - pa2;
          if (aaDO2 >= 500) aps += 4;
          else if (aaDO2 >= 350) aps += 3;
          else if (aaDO2 >= 200) aps += 2;
          else aps += 0;
        }
      } else {
        if (pa2 > 70) aps += 0;
        else if (pa2 > 61) aps += 1;
        else if (pa2 >= 55) aps += 3;
        else aps += 4;
      }
    }

    // 6. pH
    const p = parseFloat(ph);
    if (!isNaN(p)) {
      if (p >= 7.7) aps += 4;
      else if (p >= 7.6) aps += 3;
      else if (p >= 7.5) aps += 1;
      else if (p >= 7.33) aps += 0;
      else if (p >= 7.25) aps += 2;
      else if (p >= 7.15) aps += 3;
      else aps += 4;
    }

    // 7. Sodium
    const sod = parseFloat(na);
    if (!isNaN(sod)) {
      if (sod >= 180) aps += 4;
      else if (sod >= 160) aps += 3;
      else if (sod >= 155) aps += 2;
      else if (sod >= 150) aps += 1;
      else if (sod >= 130) aps += 0;
      else if (sod >= 120) aps += 2;
      else if (sod >= 111) aps += 3;
      else aps += 4;
    }

    // 8. Potassium
    const pot = parseFloat(k);
    if (!isNaN(pot)) {
      if (pot >= 7) aps += 4;
      else if (pot >= 6) aps += 3;
      else if (pot >= 5.5) aps += 1;
      else if (pot >= 3.5) aps += 0;
      else if (pot >= 3) aps += 1;
      else if (pot >= 2.5) aps += 2;
      else aps += 4;
    }

    // 9. Creatinine
    const crea = parseFloat(cr);
    if (!isNaN(crea)) {
      let pts = 0;
      if (crea >= 3.5) pts = 4;
      else if (crea >= 2) pts = 3;
      else if (crea >= 1.5) pts = 2;
      else if (crea >= 0.6) pts = 0;
      else pts = 2;
      
      if (aki === 'yes') pts = Math.min(pts * 2, 8);
      aps += pts;
    }

    // 10. Hematocrit
    const hc = parseFloat(hct);
    if (!isNaN(hc)) {
      if (hc >= 60) aps += 4;
      else if (hc >= 50) aps += 2;
      else if (hc >= 46) aps += 1;
      else if (hc >= 30) aps += 0;
      else if (hc >= 20) aps += 2;
      else aps += 4;
    }

    // 11. WBC
    const wb = parseFloat(wbc);
    if (!isNaN(wb)) {
      if (wb >= 40) aps += 4;
      else if (wb >= 20) aps += 2;
      else if (wb >= 15) aps += 1;
      else if (wb >= 3) aps += 0;
      else if (wb >= 1) aps += 2;
      else aps += 4;
    }

    // 12. GCS
    const g = parseFloat(gcs);
    if (!isNaN(g)) {
      aps += (15 - g);
    }

    // Age Score
    let ageScore = 0;
    const a = parseFloat(age);
    if (!isNaN(a)) {
      if (a < 45) ageScore = 0;
      else if (a < 55) ageScore = 2;
      else if (a < 65) ageScore = 3;
      else if (a < 75) ageScore = 5;
      else ageScore = 6;
    }

    // Chronic Health
    let chronScore = 0;
    if (hasChronic === 'yes') {
      chronScore = chronicType === 'elective' ? 2 : 5;
    }

    const total = aps + ageScore + chronScore;

    let mort = '~4%';
    if (total > 34) mort = '~85%';
    else if (total > 29) mort = '~73%';
    else if (total > 24) mort = '~55%';
    else if (total > 19) mort = '~40%';
    else if (total > 14) mort = '~25%';
    else if (total > 9) mort = '~15%';
    else if (total > 4) mort = '~8%';

    return { total, aps, ageScore, chronScore, mort };
  };

  const result = calculateScore();

  const syncFields = useMemo(() => {
    return [
      { key: 'age' as const, label: 'Usia', value: age, setter: setAge, unit: 'tahun' },
      { key: 'temp' as const, label: 'Suhu', value: temp, setter: setTemp, unit: '°C' },
      { key: 'map' as const, label: 'MAP', value: map, setter: setMap, unit: 'mmHg' },
      { key: 'hr' as const, label: 'HR', value: hr, setter: setHr, unit: 'x/menit' },
      { key: 'rr' as const, label: 'RR', value: rr, setter: setRr, unit: 'x/menit' },
      { key: 'fio2' as const, label: 'FiO2', value: fio2, setter: setFio2, unit: '%' },
      { key: 'pao2' as const, label: 'PaO2', value: pao2, setter: setPao2, unit: 'mmHg' },
      { key: 'pco2' as const, label: 'PaCO2', value: paco2, setter: setPaco2, unit: 'mmHg' },
      { key: 'ph' as const, label: 'pH', value: ph, setter: setPh, unit: '' },
      { key: 'na' as const, label: 'Natrium', value: na, setter: setNa, unit: 'mEq/L' },
      { key: 'k' as const, label: 'Kalium', value: k, setter: setK, unit: 'mEq/L' },
      { key: 'creatinine' as const, label: 'Kreatinin', value: cr, setter: setCr, unit: 'mg/dL' },
      { key: 'leukosit' as const, label: 'WBC', value: wbc, setter: setWbc, unit: '10^3/µL' },
    ];
  }, [age, temp, map, hr, rr, fio2, pao2, paco2, ph, na, k, cr, wbc]);

  const handleAutofill = (data: any) => {
    if (data.age && typeof setAge !== 'undefined') setAge(data.age);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Unified Clinical Synchronization Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
               <Stethoscope className="w-5 h-5 text-cyan-500" />
               APACHE-II Score
             </h2>
             <p className="text-sm text-muted-foreground mt-1">Acute Physiology and Chronic Health Evaluation</p>
           </div>
         </div>

         <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 p-3 rounded-lg text-sm mb-6">
            <strong>📌 Catatan:</strong> Isi parameter yang tersedia. Kosongkan parameter yang tidak dicek (skor dihitung dari data yang diisi). Gunakan nilai <strong>terburuk</strong> dalam 24 jam pertama masuk ICU.
         </div>

         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-sm text-cyan-500 uppercase tracking-wider">📋 Data Umum</h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Usia (tahun)</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Cth: 65" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tipe masuk ICU</label>
                  <select value={chronicType} onChange={e => setChronicType(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all">
                    <option value="nonop">Non-operatif / Medis</option>
                    <option value="emergency">Post-op Emergency</option>
                    <option value="elective">Post-op Elektif</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Komorbiditas Berat (Chronic Health)</label>
                  <div className="text-[11px] text-muted-foreground mb-2">Sirosis hati, NYHA IV, PPOK berat, dialisis kronik, imunosupresi, dll.</div>
                  <select value={hasChronic} onChange={e => setHasChronic(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all">
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
                    <input type="number" value={temp} onChange={e => setTemp(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">MAP (mmHg)</label>
                    <input type="number" value={map} onChange={e => setMap(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nadi (bpm)</label>
                    <input type="number" value={hr} onChange={e => setHr(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">RR (/mnt)</label>
                    <input type="number" value={rr} onChange={e => setRr(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-1 block">GCS Total (3-15)</label>
                    <input type="number" value={gcs} onChange={e => setGcs(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
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
                    <input type="number" step="0.01" value={fio2} onChange={e => setFio2(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="0.21 - 1.0 (Opsional)" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">PaO₂ (mmHg)</label>
                    <input type="number" value={pao2} onChange={e => setPao2(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">PaCO₂ (mmHg)</label>
                    <input type="number" value={paco2} onChange={e => setPaco2(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Bila FiO2 ≥ 0.5" />
                  </div>
                  <div className="col-span-2">
                     <label className="text-sm font-medium mb-1 block">pH Arteri</label>
                     <input type="number" step="0.01" value={ph} onChange={e => setPh(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
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
                    <input type="number" value={na} onChange={e => setNa(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Kalium (mEq/L)</label>
                    <input type="number" step="0.1" value={k} onChange={e => setK(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Kreatinin (mg/dL)</label>
                    <input type="number" step="0.1" value={cr} onChange={e => setCr(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Gagal Ginjal Akut?</label>
                    <select value={aki} onChange={e => setAki(e.target.value)} className="w-full p-2 border rounded-lg bg-background text-sm">
                      <option value="no">Tidak / Stabil</option>
                      <option value="yes">Ya (Skor Cr x2)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Hematokrit (%)</label>
                    <input type="number" step="0.1" value={hct} onChange={e => setHct(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Leukosit (×10³/mm³)</label>
                    <input type="number" step="0.1" value={wbc} onChange={e => setWbc(e.target.value)} className="w-full bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-2 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/50 text-[14px] transition-all" placeholder="Opsional" />
                  </div>
                </div>
              </div>
            </div>
         </div>

         <div className="mt-8 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center px-2">
              <div className="text-center md:text-left">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">APACHE-II SCORE TOTAL</div>
                <div className={`text-5xl font-black ${result.total > 15 ? 'text-red-500' : 'text-cyan-500'}`}>{result.total}</div>
                <div className="text-sm font-medium mt-2">
                   Estimasi Mortalitas ICU: <span className="text-foreground font-bold">{result.mort}</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-[#2C2C2E]/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 w-full md:w-auto text-sm space-y-1">
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
              </div>
            </div>
         </div>
      </div>

      <Accordion title="📖 Teori APACHE-II Score (Knaus et al. 1985)">
        <ul className="pl-4 space-y-1 list-disc text-muted-foreground text-sm">
          <li><strong className="text-foreground">Latar Belakang:</strong> APACHE-II (1985) adalah sistem penilaian keparahan penyakit ICU yang banyak digunakan secara historis. Diperuntukkan untuk prediksi mortalitas populasi, *bukan* keputusan individual.</li>
          <li><strong className="text-foreground">Keterbatasan:</strong> Dikembangkan dari data 1979-1982 sehingga kalibarsinya secara umum sudah tidak akurat (cenderung overestimasi mortalitas) dibandingkan populasi ICU modern.</li>
          <li><strong className="text-foreground">Rekomendasi Praktis:</strong> Untuk general ICU mortality dapat dihitung dengan SAPS-3 (skor online terpisah). Untuk monitoring harian disfungsi organ, SOFA Score lebih disarankan karena lebih prediktif untuk mortalitas di era Sepsis-3 (Raith EP et al. 2017).</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 Knaus WA et al. (1985) Crit Care Med; Raith EP et al. (2017) JAMA.
        </div>
      </Accordion>
    </div>
  );
}
