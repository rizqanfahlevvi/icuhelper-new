import React, { useMemo, useState } from 'react';
import { Activity, Wind, ListCheck, CheckCircle2, AlertTriangle, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { usePatientStore } from '../../store/usePatientStore';
import { PageHeader } from '../../components/ui/PageHeader';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner, type SyncField } from '../../components/UnifiedSyncBanner';
import { calcIbw } from '../../utils/anthropometry';
import { rsbi as calcRsbi, interpretRsbi, RSBI_THRESHOLD } from '../../utils/ventilation';
import { AbbrLegend } from '../../components/ui/AbbrLegend';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { CalcActionBar } from '../../components/ui/CalcActionBar';
import { useCalcTrigger } from '../../hooks/useCalcTrigger';
import { rsbiSummary } from '../../utils/respirasiSummary';

interface WeaningResult {
  rsbi: string;
  rsbiOk: boolean;
  rsbiColor: string;
  rsbiInterp: string;
  vtL: string;
  vtKg: string | null;
  mipRes: { value: number; color: string; text: string } | null;
  mepRes: { value: number; color: string; text: string } | null;
  mvNum: number | null;
}

const INPUT_CLS = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
const MISSING_RING = ' ring-2 ring-[var(--sys-red)]';

export default function WeaningIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [rr, setRr] = useState('');
  const [vt, setVt] = useState('');
  const [bb, setBb] = useState('');
  const [mip, setMip] = useState('');
  const [mep, setMep] = useState('');
  const [peep, setPeep] = useState('');
  const [ps, setPs] = useState('');
  const [mv, setMv] = useState('');
  const [result, setResult] = useState<WeaningResult | null>(null);

  const isFav = isFavorite('/weaning');

  // VT spontan dinilai per kg BB PREDIKSI (PBW/IBW, Devine) — bukan BB aktual.
  const patientHeight = usePatientStore((st) => st.heightCm);
  const patientGender = usePatientStore((st) => st.gender);
  const patientPbw = useMemo(() => {
    const h = parseFloat(patientHeight);
    if (!(h > 0) || (patientGender !== 'L' && patientGender !== 'P')) return '';
    return calcIbw(h, patientGender === 'P').toFixed(1);
  }, [patientHeight, patientGender]);

  // RR saat SBT: impor saja (nilai uji tidak ditulis balik ke tanda vital pasien).
  // PEEP SBT sengaja TIDAK disinkron: setelan uji (≈5) bukan setelan ventilator pasien.
  const syncFields = useMemo<SyncField[]>(() => [
    { key: 'rr', label: 'RR', value: rr, setter: setRr, unit: 'x/menit', importOnly: true },
  ], [rr]);

  const calculateRSBI = () => {
    const rrNum = parseFloat(rr);
    const vtNum = parseFloat(vt);
    const bbNum = parseFloat(bb);
    if (!rrNum || !vtNum) { setResult(null); return; }

    const vtL = vtNum / 1000;
    // Yang & Tobin 1991: ambang tunggal 105 (zona "80–105 borderline" dulu tidak bersumber).
    const rsbi = calcRsbi(rrNum, vtNum) as number;
    const ri = interpretRsbi(rsbi);
    const rsbiColor = ri.ok ? 'text-green-500' : 'text-red-500';
    const rsbiInterp = ri.text;

    let mipRes = null;
    if (mip) {
      const m = parseFloat(mip);
      const absM = Math.abs(m);
      mipRes = {
        value: m,
        color: absM >= 30 ? 'text-green-500' : absM >= 20 ? 'text-amber-500' : 'text-red-500',
        text: (absM >= 30 ? 'Lebih negatif dari −30' : absM >= 20 ? 'Antara −20 dan −30' : 'Kurang negatif dari −20 (lemah)') +
          ' — kriteria tradisional; sensitif tetapi tidak spesifik (Yang & Tobin: sensitivitas 1,00, spesifisitas 0,11)',
      };
    }

    let mepRes = null;
    if (mep) {
      const m = parseFloat(mep);
      mepRes = {
        value: m,
        color: m >= 40 ? 'text-green-500' : 'text-red-500',
        text: m >= 40 ? '≥40: tidak di bawah ambang risiko' : '<40: lemah — pada GBS berhubungan dengan progresi ke gagal napas (Lawn 2001); nilai kemampuan batuk & sekret',
      };
    }

    setResult({
      rsbi: rsbi.toFixed(0),
      rsbiOk: ri.ok,
      rsbiColor,
      rsbiInterp,
      vtL: vtL.toFixed(2),
      vtKg: bbNum ? (vtNum / bbNum).toFixed(1) : null,
      mipRes,
      mepRes,
      mvNum: mv ? parseFloat(mv) : null
    });
  };

  // Hitung sekali → setelah itu hasil ikut berubah otomatis (tidak ada hasil basi). Riwayat lewat tombol Simpan.
  const calc = useCalcTrigger({
    compute: () => calculateRSBI(),
    deps: [rr, vt, bb, mip, mep, mv],
    required: [
      { id: 'wean-rr', label: 'RR spontan', filled: parseFloat(rr) > 0 },
      { id: 'wean-vt', label: 'VT spontan', filled: parseFloat(vt) > 0 },
    ],
  });
  const barSum = calc.armed && result ? rsbiSummary(result.rsbi, result.rsbiInterp, result.rsbiOk) : null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Page Title & Bookmark */}
      <div className="md:pt-2">
        <PageHeader 
          compact
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

      <ActivePatientBriefCard />
      <UnifiedSyncBanner fields={syncFields} />

      {/* SECTION 1: Kalkulator RSBI */}
      <section className="bg-card border border-border shadow-sm rounded-2xl p-5 md:p-6 overflow-hidden relative">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-blue-500" /> 
          Kalkulator RSBI & Readiness to Wean
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          <strong>RSBI (Rapid Shallow Breathing Index)</strong> = RR spontan / VT (L). Studi asli (Yang & Tobin 1991) mengukur pada menit pertama napas spontan tanpa bantuan; ambang {RSBI_THRESHOLD}.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div>
              <label htmlFor="wean-rr" className="text-xs font-medium text-muted-foreground mb-1 block">RR Spontan (/mnt)</label>
              <input id="wean-rr" type="number" inputMode="decimal" className={INPUT_CLS + (calc.isMissing('wean-rr') ? MISSING_RING : '')} placeholder="cth: 18" value={rr} onChange={e => setRr(e.target.value)} />
            </div>
            <div>
              <label htmlFor="wean-vt" className="text-xs font-medium text-muted-foreground mb-1 block">VT Spontan (mL)</label>
              <input id="wean-vt" type="number" inputMode="decimal" className={INPUT_CLS + (calc.isMissing('wean-vt') ? MISSING_RING : '')} placeholder="cth: 400" value={vt} onChange={e => setVt(e.target.value)} />
            </div>
            <div>
              <label htmlFor="wean-bb" className="text-xs font-medium text-muted-foreground mb-1 block">BB Prediksi / PBW (kg)</label>
              <input id="wean-bb" type="number" inputMode="decimal" className={INPUT_CLS} placeholder="cth: 61.4" value={bb} onChange={e => setBb(e.target.value)} />
              {patientPbw && bb !== patientPbw && (
                <button
                  type="button"
                  onClick={() => setBb(patientPbw)}
                  className="mt-1.5 text-[11px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Gunakan PBW pasien: {patientPbw} kg (TB {patientHeight} cm, {patientGender})
                </button>
              )}
            </div>
            <div>
              <label htmlFor="wean-mv" className="text-xs font-medium text-muted-foreground mb-1 block">MV (Menit Volume, L/mnt)</label>
              <input id="wean-mv" type="number" inputMode="decimal" className={INPUT_CLS} placeholder="cth: 7.2" value={mv} onChange={e => setMv(e.target.value)} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label htmlFor="wean-mip" className="text-xs font-medium text-muted-foreground mb-1 block">MIP / NIF (cmH₂O) <span className="opacity-50">(opsional)</span></label>
              <input id="wean-mip" type="number" inputMode="decimal" className={INPUT_CLS} placeholder="misal -35" value={mip} onChange={e => setMip(e.target.value)} />
            </div>
            <div>
              <label htmlFor="wean-mep" className="text-xs font-medium text-muted-foreground mb-1 block">MEP (cmH₂O) <span className="opacity-50">(opsional)</span></label>
              <input id="wean-mep" type="number" inputMode="decimal" className={INPUT_CLS} placeholder="normal >60" value={mep} onChange={e => setMep(e.target.value)} />
            </div>
            <div>
              <label htmlFor="wean-peep" className="text-xs font-medium text-muted-foreground mb-1 block">PEEP saat ini (cmH₂O)</label>
              <input id="wean-peep" type="number" inputMode="decimal" className={INPUT_CLS} placeholder="cth: 5" value={peep} onChange={e => setPeep(e.target.value)} />
            </div>
            <div>
              <label htmlFor="wean-ps" className="text-xs font-medium text-muted-foreground mb-1 block">PS saat ini (cmH₂O)</label>
              <input id="wean-ps" type="number" inputMode="decimal" className={INPUT_CLS} placeholder="cth: 8" value={ps} onChange={e => setPs(e.target.value)} />
            </div>
          </div>
        </div>

        {calc.armed && result && (
          <div id="weaning-hasil" className="scroll-mt-4 mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
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
                    {result.mvNum > 10 ? '⚠ >10 L/mnt (kriteria tradisional)' : result.mvNum < 5 ? '⚠ Rendah' : '≤10 L/mnt'}
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
                 <div><strong className="block">⚠ Support Tidak Minimal</strong>Yang & Tobin mengukur RSBI saat napas spontan tanpa bantuan (T-piece, menit pertama). PEEP/PS menurunkan nilai RSBI sehingga bisa tampak lebih baik dari sebenarnya.</div>
               </div>
            )}

            <SaveToHistoryButton
              module="weaning"
              label="RSBI & Readiness to Wean"
              inputs={{ rr, vt, bb, mip, mep, peep, ps, mv }}
              summary={`RSBI: ${result.rsbi} bpm/L - ${result.rsbiInterp}`}
              className="w-full mt-4"
            />
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
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> RSBI ≤105 breaths/mnt/L (Yang & Tobin; bukan kriteria tunggal)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> VT spontan ≥5 mL/kg PBW (kriteria tradisional)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> MIP/NIF lebih negatif dari −20 s/d −30 cmH₂O (kriteria tradisional, spesifisitas rendah)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> MEP ≥40 cmH₂O (di bawahnya: batuk lemah; ambang risiko GBS — Lawn 2001)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Batuk efektif (sekret dapat dikeluarkan)</li>
                <li className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Risiko tinggi stridor pasca-ekstubasi: cuff leak test — ada kebocoran (ATS/ACCP 2017)</li>
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
             <p className="text-sm text-muted-foreground mb-2"><strong>Metode:</strong> SBT awal dengan pressure support 5–8 cmH₂O (saran ATS/ACCP 2017) atau T-piece; SBT awal 30 menit (Boles 2007).</p>
             <p className="text-sm text-muted-foreground mb-2"><strong>Bukti:</strong> PS 8 cmH₂O 30 menit vs T-piece 2 jam → ekstubasi sukses 82,3% vs 74,0% (Subirà 2019).</p>
             <p className="text-sm text-muted-foreground mb-2"><strong>Target Sukses:</strong> SpO₂ ≥90%, RR &lt;35/mnt, HR ±20% baseline, tanpa distress napas.</p>
             <p className="text-sm text-muted-foreground mt-auto pt-4 italic font-mono text-[10px]">📚 Boles JM. Eur Respir J 2007 · Ouellette DR. Chest 2017 · Subirà C. JAMA 2019 · Ely EW. NEJM 1996</p>
           </div>
           {/* Ekstubasi */}
           <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
             <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-1 rounded text-xs w-fit mb-3">LANGKAH 2</div>
             <h3 className="font-bold text-md mb-2">Prosedur Ekstubasi</h3>
             <p className="text-sm text-muted-foreground mb-2"><strong>Persiapan:</strong> Suction ETT/subglotis. Pasien risiko tinggi stridor: cuff leak test; bila gagal tetapi siap ekstubasi → steroid sistemik ≥4 jam sebelum ekstubasi (ATS/ACCP 2017). Regimen terbukti: metilprednisolon 20 mg IV 12 jam sebelum lalu tiap 4 jam hingga ekstubasi — edema laring 3% vs 22% (François 2007).</p>
             <p className="text-sm text-muted-foreground mb-2"><strong>Eksekusi:</strong> Head-up 45°. Deflasi cuff total, tarik saat akhir inspirasi.</p>
             <p className="text-sm text-muted-foreground mt-auto pt-4 italic font-mono text-[10px]">Siapkan rencana A & B jalan napas.</p>
           </div>
           {/* Post Ext */}
           <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-full">
             <div className="bg-emerald-500/10 text-emerald-600 font-bold px-2 py-1 rounded text-xs w-fit mb-3">LANGKAH 3</div>
             <h3 className="font-bold text-md mb-2">Post-Ekstubasi</h3>
             <p className="text-sm text-muted-foreground mb-2"><strong>Profilaksis:</strong> Pasien risiko tinggi (mis. hiperkapnia, PPOK, obesitas) yang diventilasi &gt;24 jam: NIV preventif segera setelah ekstubasi (rekomendasi KUAT ATS/ACCP 2017); HFNC sebagai alternatif (Hernández 2016).</p>
             <p className="text-sm text-muted-foreground mb-2 text-red-500"><strong>Gagal napas pasca-ekstubasi:</strong> JANGAN memakai NIV untuk mengobati gagal napas yang sudah terjadi — reintubasi tidak berkurang (48% vs 48%), mortalitas ICU 25% vs 14%, reintubasi tertunda 12 vs 2,5 jam (Esteban 2004). Distress berat → segera reintubasi.</p>
             <p className="text-sm text-muted-foreground mt-auto pt-4 italic font-mono text-[10px]">📚 Ouellette DR. Chest 2017 · Hernández G. JAMA 2016 · Esteban A. NEJM 2004</p>
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
                    <td className="p-3">≤105 bpm/L</td>
                    <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 rounded text-xs font-bold">Prediktor sukses</span></td>
                    <td className="p-3">Lanjutkan SBT bila kriteria kesiapan lain terpenuhi (sensitivitas 0,97; spesifisitas 0,64)</td>
                  </tr>
                  <tr>
                    <td className="p-3">&gt;105 bpm/L</td>
                    <td className="p-3"><span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 rounded text-xs font-bold">Prediktor gagal</span></td>
                    <td className="p-3">Cari & atasi penyebab (beban napas, kardiak, neuromuskular, metabolik) sebelum SBT ulang</td>
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
              <li><strong>Rule of 20-30-40 (GBS, Lawn 2001):</strong> VC &lt;20 mL/kg, MIP lebih lemah dari −30, MEP &lt;40 cmH₂O → risiko progresi ke gagal napas/perlu intubasi. Ini prediktor intubasi, BUKAN target weaning.</li>
              <li>Yang & Tobin 1991: PImax sangat sensitif (1,00) tetapi spesifisitasnya rendah (0,11) sebagai prediktor weaning.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary">Klasifikasi Weaning (Boles 2007)</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Sederhana:</strong> berhasil ekstubasi pada SBT pertama.</li>
              <li><strong className="text-foreground">Sulit:</strong> gagal SBT awal dan butuh hingga 3 SBT atau hingga 7 hari sejak SBT pertama.</li>
              <li><strong className="text-foreground">Lama (prolonged):</strong> gagal ≥3 SBT atau butuh &gt;7 hari sejak SBT pertama.</li>
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
      <AbbrLegend
        terms={[
          'RSBI', 'SBT', 'RR', 'VT', 'PBW', 'TB', 'BB', 'MV', 'MIP', 'NIF', 'MEP', 'PImax', 'PEEP', 'PS', 'RASS',
          'NMB', 'GBS', 'VC-kapasitas', 'ATS', 'ACCP', 'SpO2', 'FiO2', 'HR', 'ETT', 'PPOK', 'NIV', 'HFNC', 'ICU', 'IV',
          'BNP', 'VIDD', 'CAM-ICU',
        ]}
      />
      <CalcActionBar
        armed={calc.armed}
        onCalculate={calc.trigger}
        label="Evaluasi Weaning (RSBI)"
        summary={barSum?.text ?? null}
        summaryTone={barSum?.tone ?? 'neutral'}
        caption={barSum?.caption}
        missing={calc.missing}
        resultTargetId="weaning-hasil"
      />
    </div>
  );
}
