import React, { useState } from 'react';
import { Activity, Wind, ListCheck, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { PageHeader } from '../../components/ui/PageHeader';

export default function WeaningIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const addHistory = useHistoryStore((state) => state.addEntry);
  const [rr, setRr] = useState('');
  const [vt, setVt] = useState('');
  const [bb, setBb] = useState('');
  const [mip, setMip] = useState('');
  const [mep, setMep] = useState('');
  const [peep, setPeep] = useState('');
  const [ps, setPs] = useState('');
  const [mv, setMv] = useState('');
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

    let mipRes = null;
    if (mip) {
      const m = parseFloat(mip);
      const absM = Math.abs(m);
      mipRes = {
        value: m,
        color: absM >= 30 ? 'text-green-500' : absM >= 20 ? 'text-amber-500' : 'text-red-500',
        text: absM >= 30 ? 'Adekuat (≥-30): kekuatan otot napas baik' : absM >= 20 ? 'Borderline (-20 s/d -30): evaluasi faktor lain' : 'Lemah (<-20): risiko gagal ekstubasi — tunda'
      };
    }

    let mepRes = null;
    if (mep) {
      const m = parseFloat(mep);
      mepRes = {
        value: m,
        color: m >= 60 ? 'text-green-500' : m >= 40 ? 'text-amber-500' : 'text-red-500',
        text: m >= 60 ? 'Normal (≥60): batuk efektif' : m >= 40 ? 'Borderline (40–60): monitor batuk' : 'Lemah (<40): risiko aspirasi, batuk tidak efektif'
      };
    }

    setResult({
      rsbi: rsbi.toFixed(0),
      rsbiColor,
      rsbiInterp,
      vtL: vtL.toFixed(2),
      vtKg: bbNum ? (vtNum / bbNum).toFixed(1) : null,
      mipRes,
      mepRes,
      mvNum: mv ? parseFloat(mv) : null
    });

    addHistory('weaning', 'RSBI & Readiness to Wean', { rr, vt, bb, mip, mep, peep, ps, mv }, `RSBI: ${rsbi.toFixed(0)} bpm/L - ${rsbiInterp}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Page Title & Bookmark */}
      <div className="pt-2">
        <PageHeader 
          badgeIcon={Wind}
          badgeText="VENTILASI MEKANIK"
          title="Weaning Evaluator"
          description="Evaluasi kesiapan ekstubasi & pelepasan ventilator (weaning), kalkulator RSBI spontan, serta checklist kesiapan klinis."
          rightContent={
            <button
              onClick={() => toggleFavorite('/weaning')}
              className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all active:scale-95 ${isFav ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
            >
              <Star className={`w-4 h-4 sm:mr-2 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Difavoritkan' : 'Favoritkan'}</span>
            </button>
          }
        />
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
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">MV (Menit Volume, L/mnt)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="cth: 7.2" value={mv} onChange={e => setMv(e.target.value)} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">MIP / NIF (cmH₂O) <span className="opacity-50">(opsional)</span></label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="misal -35" value={mip} onChange={e => setMip(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">MEP (cmH₂O) <span className="opacity-50">(opsional)</span></label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="normal >60" value={mep} onChange={e => setMep(e.target.value)} />
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
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-card border border-border p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">RR Spontan</div>
                <div className="font-bold">{rr} <span className="text-[10px] font-normal">/mnt</span></div>
              </div>
              <div className="bg-card border border-border p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">VT Spontan</div>
                <div className="font-bold">{vt} <span className="text-[10px] font-normal">mL</span></div>
                {result.vtKg && <div className="text-[10px] text-muted-foreground">{result.vtKg} mL/kg</div>}
              </div>
              <div className="bg-card border border-border p-3 rounded-lg text-center">
                <div className="text-xs text-muted-foreground">RSBI</div>
                <div className={`font-bold ${result.rsbiColor}`}>{result.rsbi} <span className="text-[10px] font-normal text-foreground">bpm/L</span></div>
              </div>
              {result.mvNum !== null && (
                <div className="bg-card border border-border p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground">MV</div>
                  <div className="font-bold">
                    {result.mvNum.toFixed(1)} <span className="text-[10px] font-normal">L/mnt</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {result.mvNum > 10 ? '⚠ Tinggi' : result.mvNum < 5 ? '⚠ Rendah' : 'Normal'}
                  </div>
                </div>
              )}
            </div>

            {result.mipRes && (
              <div className="mb-2 text-sm">
                MIP/NIF = {result.mipRes.value} cmH₂O → <strong className={result.mipRes.color}>{result.mipRes.text}</strong>
              </div>
            )}
            
            {result.mepRes && (
              <div className="mb-2 text-sm">
                MEP = {result.mepRes.value} cmH₂O → <strong className={result.mepRes.color}>{result.mepRes.text}</strong>
              </div>
            )}

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
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> pH ≥7.25</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Kesadaran cukup (RASS -1 s/d +1)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Tidak dalam NMB (pelumpuh otot) aktif</li>
             </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
             <h3 className="font-bold text-sm mb-3">Kriteria Kekuatan & Jalan Napas</h3>
             <ul className="space-y-2 text-sm">
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> RSBI &lt;80 breaths/mnt/L</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> VT spontan ≥5 mL/kg IBW</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> MIP/NIF ≤ -25 cmH₂O (idealnya ≤ -30)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> MEP ≥40 cmH₂O (GBS/MG: ≥60)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Batuk efektif (sekret dapat dikeluarkan)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Cuff leak test positif (tidak ada laryngeal edema)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> CAM-ICU negatif (tidak delirium aktif)</li>
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

      {/* SECTION 4: Teori Weaning */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Teori RSBI, MIP/NIF & Prediksi Weaning Sukses</h2>
        
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">RSBI (Rapid Shallow Breathing Index)</h3>
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-3 font-semibold">Nilai RSBI</th>
                    <th className="p-3 font-semibold">Interpretasi</th>
                    <th className="p-3 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">&lt;80 bpm/L</td>
                    <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded text-xs font-bold">Baik</span></td>
                    <td className="p-3">Pertimbangkan ekstubasi jika kriteria lain terpenuhi</td>
                  </tr>
                  <tr>
                    <td className="p-3">80–105 bpm/L</td>
                    <td className="p-3"><span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 rounded text-xs font-bold">Borderline</span></td>
                    <td className="p-3">SBT lebih panjang; evaluasi faktor penghambat</td>
                  </tr>
                  <tr>
                    <td className="p-3">&gt;105 bpm/L</td>
                    <td className="p-3"><span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 rounded text-xs font-bold">Buruk</span></td>
                    <td className="p-3">Weaning kemungkinan gagal; optimalkan kondisi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">MIP/NIF (Maximal Inspiratory Pressure)</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li><strong>Pengukuran:</strong> Oklusi sirkuit napas selama 20 detik → pasien menarik napas maksimal → baca tekanan negatif maksimum.</li>
              <li>MIP ≤ −30 cmH₂O: Kekuatan otot napas adekuat untuk ekstubasi</li>
              <li>MIP −20 s/d −30 cmH₂O: Borderline — evaluasi faktor lain</li>
              <li>MIP &gt; −20 cmH₂O (mis. -10): Lemah → risiko gagal ekstubasi tinggi</li>
              <li><strong>Pada GBS/MG:</strong> Target MIP ≤ −30 (rule of 20-30-40)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">Faktor Penghambat Weaning</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Kardiovaskular:</strong> gagal jantung kiri tersembunyi (periksa echo, BNP)</li>
              <li><strong className="text-foreground">Psikologis:</strong> ketergantungan ventilator, anxietas, ICU-acquired weakness</li>
              <li><strong className="text-foreground">Metabolik:</strong> hipofosfatemia, hipomagnesemia, hipotiroid (↓ kekuatan otot napas)</li>
              <li><strong className="text-foreground">Neuromuskuler:</strong> VIDD (diaphragm dysfunction), polineuropati ICU</li>
              <li><strong className="text-foreground">Sekret berlebihan:</strong> suction tidak adekuat, bronkospasme</li>
              <li><strong className="text-foreground">Delirium:</strong> CAM-ICU positif → tunda ekstubasi, atasi delirium</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
