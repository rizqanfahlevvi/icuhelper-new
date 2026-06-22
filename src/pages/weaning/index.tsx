import React, { useState } from 'react';
import { Activity, Wind, ListCheck, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';

export default function WeaningIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [rr, setRr] = useState('');
  const [vt, setVt] = useState('');
  const [bb, setBb] = useState('');
  const [mip, setMip] = useState('');
  const [peep, setPeep] = useState('');
  const [ps, setPs] = useState('');
  const [result, setResult] = useState<any>(null);

  const isFav = isFavorite('/weaning');

  const calculateRSBI = () => {
    const rrNum = parseFloat(rr);
    const vtNum = parseFloat(vt);
    const bbNum = parseFloat(bb);
    if (!rrNum || !vtNum) return;

    const vtL = vtNum / 1000;
    const rsbi = rrNum / vtL;
    
    let rsbiColor = 'text-green-500';
    let rsbiInterp = 'Baik — Pertimbangkan Ekstubasi';
    if (rsbi > 105) { rsbiColor = 'text-red-500'; rsbiInterp = 'Risiko Gagal Weaning Tinggi'; }
    else if (rsbi > 80) { rsbiColor = 'text-amber-500'; rsbiInterp = 'Borderline'; }

    setResult({
      rsbi: rsbi.toFixed(0),
      rsbiColor,
      rsbiInterp,
      vtL: vtL.toFixed(2),
      vtKg: bbNum ? (vtNum / bbNum).toFixed(1) : null
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Title & Bookmark */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Wind className="w-6 h-6 text-primary" /> Weaning Evaluator
          <button
            onClick={() => toggleFavorite('/weaning')}
            className="p-1.5 rounded-full hover:bg-muted transition-colors ml-1"
            title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
          >
            <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
          </button>
        </h1>
        <p className="text-muted-foreground text-[13px] mt-1">
          Evaluasi kesiapan ekstubasi & pelepasan ventilator (weaning), kalkulator RSBI spontan, serta checklist kesiapan klinis.
        </p>
      </div>

      {/* SECTION 1: Kalkulator RSBI */}
      <section className="bg-card border border-border shadow-sm rounded-2xl p-5 md:p-6 overflow-hidden relative">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-blue-500" /> 
          Kalkulator RSBI & Readiness to Wean
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          <strong>RSBI (Rapid Shallow Breathing Index)</strong> = RR spontan / VT (L). Diukur saat SBT minimal (PEEP 5, PS ≤5 cmH₂O atau T-piece, selama 1–3 menit spontan breathing).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">RR Spontan (/mnt)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="cth: 18" value={rr} onChange={e => setRr(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">VT Spontan (mL)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="cth: 400" value={vt} onChange={e => setVt(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">BB / IBW (kg)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="cth: 65" value={bb} onChange={e => setBb(e.target.value)} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">MIP / NIF (cmH₂O) <span className="opacity-50">(opsional)</span></label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="misal -35" value={mip} onChange={e => setMip(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">PEEP saat ini (cmH₂O)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="cth: 5" value={peep} onChange={e => setPeep(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">PS saat ini (cmH₂O)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="cth: 8" value={ps} onChange={e => setPs(e.target.value)} />
            </div>
          </div>
        </div>

        <button onClick={calculateRSBI} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full md:w-auto">Evaluasi Weaning</button>

        {result && (
          <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className={`text-3xl font-bold ${result.rsbiColor}`}>{result.rsbi} <span className="text-sm font-normal text-muted-foreground">bpm/L</span></div>
            <div className={`text-sm font-semibold mb-3 ${result.rsbiColor}`}>{result.rsbiInterp}</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-card border border-border p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">RR</div>
                <div className="font-bold">{rr} <span className="text-[10px] font-normal">/mnt</span></div>
              </div>
              <div className="bg-card border border-border p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">VT</div>
                <div className="font-bold">{vt} <span className="text-[10px] font-normal">mL</span></div>
                {result.vtKg && <div className="text-[10px] text-muted-foreground">{result.vtKg} mL/kg</div>}
              </div>
            </div>

            {((parseInt(peep) || 0) > 5 || parseInt(ps) > 8) && (
               <div className="mt-4 bg-amber-500/10 border-l-2 border-amber-500 p-3 rounded text-sm text-amber-700 dark:text-amber-300 dark:text-amber-500 flex gap-2">
                 <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                 <div><strong className="block">⚠ Support Tidak Minimal</strong>RSBI valid hanya pada support minimal (PEEP ≤5, PS ≤5–8 cmH₂O). Nilai PEEP/PS saat ini terlalu tinggi.</div>
               </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 2: Checklist */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <ListCheck className="w-5 h-5 text-emerald-500" />
          Readiness to Wean — Checklist Klinis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
             <h3 className="font-bold text-sm mb-3">Kriteria Klinis Dasar</h3>
             <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Penyebab gagal napas terkontrol/membaik</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> FiO₂ ≤0.40 dengan SpO₂ ≥90% (P/F ≥150)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> PEEP ≤8 cmH₂O</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Hemodinamik stabil (tanpa/dosis vasopressor rendah)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Kesadaran cukup (RASS -1 s/d +1) & CAM-ICU negatif</li>
             </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
             <h3 className="font-bold text-sm mb-3">Kriteria Kekuatan & Jalan Napas</h3>
             <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> RSBI &lt;80 breaths/mnt/L</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> VT spontan ≥5 mL/kg IBW</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> MIP/NIF ≤ -25 cmH₂O (idealnya ≤ -30)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Batuk efektif (sekret dapat dikeluarkan)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Cuff leak test positif (tidak ada laryngeal edema)</li>
             </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: SBT Protocol */}
      <section className="space-y-4">
         <h2 className="text-xl font-bold flex items-center gap-2">
           <Wind className="w-5 h-5 text-purple-500" />
           SBT Protocol & Ekstubasi
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* SBT */}
           <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
             <div className="bg-purple-500/10 text-purple-600 font-bold px-2 py-1 rounded text-xs w-fit mb-3">LANGKAH 1</div>
             <h3 className="font-bold text-md mb-2">SBT (Spontaneous Breathing Trial)</h3>
             <p className="text-sm text-muted-foreground mb-2"><strong>Metode:</strong> T-piece atau PSV 5–8 cmH₂O + PEEP 5. Durasi: 30–120 menit.</p>
             <p className="text-sm text-muted-foreground mb-2"><strong>Target Sukses:</strong> SpO₂ ≥90%, RR &lt;35/mnt, HR ±20% baseline, tanpa distress napas.</p>
             <p className="text-sm text-muted-foreground mt-auto pt-4 italic font-mono text-[10px]">📚 Ely EW. NEJM 1996</p>
           </div>
           {/* Ekstubasi */}
           <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
             <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-1 rounded text-xs w-fit mb-3">LANGKAH 2</div>
             <h3 className="font-bold text-md mb-2">Prosedur Ekstubasi</h3>
             <p className="text-sm text-muted-foreground mb-2"><strong>Premedikasi:</strong> Suction ETT/subglotis. Jika risiko laryngeal edema, beri Dexamethasone 5 mg IV.</p>
             <p className="text-sm text-muted-foreground mb-2"><strong>Eksekusi:</strong> Head-up 45°. Deflasi cuff total, tarik saat akhir inspirasi.</p>
             <p className="text-sm text-muted-foreground mt-auto pt-4 italic font-mono text-[10px]">Siapkan rencana A & B jalan napas.</p>
           </div>
           {/* Post Ext */}
           <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
             <div className="bg-emerald-500/10 text-emerald-600 font-bold px-2 py-1 rounded text-xs w-fit mb-3">LANGKAH 3</div>
             <h3 className="font-bold text-md mb-2">Post-Ekstubasi</h3>
             <p className="text-sm text-muted-foreground mb-2"><strong>Profilaksis:</strong> Pasien risiko tinggi (obesitas, PPOK, hypercapnia), gunakan HFNC atau NIV paska ekstubasi segera.</p>
             <p className="text-sm text-muted-foreground mb-2 text-red-500"><strong>Gagal:</strong> Distress napas berat menetap = segera reintubasi.</p>
             <p className="text-sm text-muted-foreground mt-auto pt-4 italic font-mono text-[10px]">📚 Hernandez G. JAMA 2016 (HFNC)</p>
           </div>
         </div>
      </section>
    </div>
  );
}
