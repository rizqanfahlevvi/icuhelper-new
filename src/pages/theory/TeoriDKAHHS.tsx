import { Accordion } from '../../components/ui/Accordion';

export default function TeoriDKAHHS() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Hiperglikemia Krisis — DKA & HHS pada Dewasa
        </h1>
        
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-destructive">🍬 Dua Krisis Hiperglikemia Akut — Spektrum, Bukan Dikotomi</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold text-destructive">🔴 DKA (Diabetic Ketoacidosis):</p>
              <p className="text-muted-foreground mt-1">Defisiensi insulin <em>absolut/relatif</em> + ↑ hormon kontraregulasi → lipolisis → <strong className="text-foreground">ketogenesis</strong> → asidosis metabolik anion gap tinggi.</p>
            </div>
            <div>
              <p className="font-bold text-warning">🟠 HHS (Hyperosmolar Hyperglycemic State):</p>
              <p className="text-muted-foreground mt-1">Insulin masih cukup untuk menekan ketogenesis namun tidak untuk mengontrol glukosa → hiperglikemia ekstrem + diuresis osmotik → <strong className="text-foreground">dehidrasi berat & hiperosmolalitas</strong>, ketosis minimal.</p>
            </div>
          </div>
          <p className="mt-3 text-destructive font-semibold">⚠️ Penting: Hingga ~⅓ kasus tumpang tindih (mixed DKA-HHS) — bisa ketoasidosis sekaligus hiperosmolar. Tatalaksana mengikuti komponen yang dominan.</p>
          <p className="mt-2 text-[11px] opacity-80 text-muted-foreground"><em>Berdasarkan Umpierrez GE, et al. Hyperglycemic Crises in Adults With Diabetes (ADA/EASD). Diabetes Care 2024 [1].</em></p>
        </div>

        </div>

        <Accordion title="📖 Kriteria Diagnosis — DKA vs HHS (Konsensus 2024)" defaultOpen={true}>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Parameter</th><th className="p-2">DKA</th><th className="p-2">HHS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Glukosa plasma</td><td className="p-2">≥200 mg/dL*</td><td className="p-2">≥600 mg/dL</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Ketonemia (BHB)</td><td className="p-2 font-bold text-destructive">≥3.0 mmol/L <span className="font-normal text-muted-foreground">(atau keton urin ≥2+)</span></td><td className="p-2">&lt;3.0 mmol/L <span className="text-muted-foreground">(minimal)</span></td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">pH arteri/vena</td><td className="p-2">&lt;7.3</td><td className="p-2">&gt;7.3</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Bikarbonat (HCO₃⁻)</td><td className="p-2">&lt;18 mmol/L</td><td className="p-2">&gt;18 mmol/L</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Osmolalitas efektif</td><td className="p-2">Bervariasi</td><td className="p-2 font-bold text-warning">&gt;300 mOsm/kg</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">Status mental</td><td className="p-2">Bervariasi (sering sadar)</td><td className="p-2">Sering ↓ (stupor/koma bila osm &gt;320)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-muted-foreground mb-4">*<strong>Perubahan kunci konsensus 2024:</strong> ambang glukosa DKA diturunkan ke <strong>≥200 mg/dL</strong>, ambang HCO₃⁻ dinaikkan ke <strong>&lt;18</strong>, dan <strong>BHB ≥3.0 mmol/L</strong> menjadi standar [1].</p>
        </Accordion>

        <Accordion title="📖 Prinsip Tatalaksana — Cairan · Kalium · Insulin">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-foreground text-[12px] mb-4 text-center">
            <strong className="text-primary text-[14px]">🎯 Urutan Prioritas: Cairan → Kalium → Insulin</strong>
            <p className="text-muted-foreground mt-1">Resusitasi cairan adalah terapi <strong>lini pertama</strong>. <strong>Jangan mulai insulin sebelum K⁺ diketahui</strong> — insulin mendorong K⁺ intrasel dan dapat mencetuskan hipokalemia fatal.</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">1. Cairan (Resusitasi)</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Mulai:</strong> NaCl 0.9% atau kristaloid seimbang — ~<strong>500–1000 mL/jam</strong> pada 1–2 jam pertama; hati-hati pada HF/CKD.</li>
            <li><strong className="text-foreground">Lanjutan:</strong> Bila Na terkoreksi normal/tinggi → ganti ke <strong>NaCl 0.45%</strong>; bila Na rendah → lanjut 0.9%.</li>
            <li><strong className="text-foreground">Na terkoreksi</strong> = Na terukur + 1.6 × [(glukosa mg/dL − 100)/100] [2].</li>
            <li><strong className="text-foreground">HHS:</strong> rehidrasi lebih bertahap; target penurunan osmolalitas ≤3–8 mOsm/kg/jam untuk cegah edema serebral [3].</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">2. Kalium (K⁺)</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">K⁺ serum (mmol/L)</th><th className="p-2">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-destructive">&lt;3.3</td><td className="p-2"><span className="px-2 py-0.5 bg-destructive/20 text-destructive rounded font-bold text-[10px] mr-2">TUNDA INSULIN</span> Beri K⁺ 10–20 mmol/jam sampai ≥3.3, lalu mulai insulin</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">3.3–5.0 (5.2)</td><td className="p-2">Tambahkan K⁺ <strong>10–20 mmol per liter</strong> cairan infus; target K⁺ 4–5</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">&gt;5.0 (5.2)</td><td className="p-2">Jangan beri K⁺ dulu; cek ulang tiap 2 jam</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">3. Insulin</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">DKA:</strong> insulin regular IV <strong>fixed-rate 0.1 unit/kg/jam</strong>. Mulai setelah rehidrasi awal berjalan dan K⁺ &gt;3.3.</li>
            <li><strong className="text-foreground">HHS:</strong> mulai insulin <strong>lebih lambat (0.05 unit/kg/jam)</strong> dan <em>hanya setelah</em> rehidrasi berjalan baik.</li>
            <li><strong className="text-foreground">Target penurunan glukosa:</strong> 50–75 mg/dL/jam.</li>
            <li><strong className="text-foreground">Tambahkan Dekstrosa (D5/D10):</strong> Saat glukosa turun &lt;200 mg/dL (DKA) / &lt;250 (HHS). <strong className="text-destructive">Insulin HARUS DITERUSKAN</strong> sampai ketoasidosis teratasi.</li>
          </ul>
        </Accordion>

        <Accordion title="📖 Monitoring, Kriteria Resolusi & Transisi ke Subkutan">
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kriteria Resolusi</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2"></th><th className="p-2">DKA — Resolusi</th><th className="p-2">HHS — Resolusi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Penanda utama</td><td className="p-2"><strong>BHB &lt;0.6 mmol/L</strong><br/><span className="text-muted-foreground">(atau anion gap normal ≤12)</span></td><td className="p-2">Osmolalitas efektif normal &amp; kesadaran pulih</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">pH / HCO₃⁻</td><td className="p-2">pH &gt;7.3 dan/atau HCO₃⁻ ≥15</td><td className="p-2 text-muted-foreground">—</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">Glukosa</td><td className="p-2 text-muted-foreground">Umumnya &lt;200 mg/dL</td><td className="p-2 text-muted-foreground">&lt;250–300 mg/dL</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground text-[12px] mb-4">
            <strong className="text-warning block mb-1">Transisi ke Insulin Subkutan</strong>
            <p className="text-muted-foreground">Syarat: kriteria resolusi tercapai, pasien sadar &amp; bisa makan. <strong>OVERLAP WAJIB:</strong> berikan insulin basal subkutan 1–2 jam SEBELUM menghentikan infus IV (mencegah rebound ketoasidosis).</p>
          </div>
        </Accordion>

        <Accordion title="📖 Hiperglikemia Stres & Target Glukosa ICU">
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground text-[12px] mb-4">
            <p className="text-muted-foreground">Hiperglikemia adalah hal yang <strong>SANGAT UMUM di ICU</strong> (40-80% pasien) meskipun tanpa riwayat diabetes. Disebabkan oleh hormon stres yang tinggi (sitokin, kortisol) dan resistensi insulin akut.</p>
          </div>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target Glukosa ICU (Konsensus 2024-2025)</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">Target Utama: 140–180 mg/dL</strong> (8.0–10.0 mmol/L) untuk mayoritas pasien ICU.</li>
            <li><strong className="text-destructive">Hindari Target Ketat (&lt;110 mg/dL):</strong> Meningkatkan insiden hipoglikemia berat yang berbahaya (NICE-SUGAR trial) [4].</li>
            <li><strong className="text-foreground">Kapan mulai insulin IV?</strong> Apabila glukosa persisten &gt;180 mg/dL pada dua kali pemeriksaan [5].</li>
          </ul>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Umpierrez GE, et al. Hyperglycemic Crises in Adults With Diabetes (ADA/EASD Consensus). <em>Diabetes Care</em>. 2024.</li>
            <li>Katz MA. Hyperglycemia-induced hyponatremia--calculation of expected serum sodium depression. <em>N Engl J Med</em>. 1973.</li>
            <li>Fayfman M, et al. Management of Hyperglycemic Crises: Diabetic Ketoacidosis and Hyperosmolar Hyperglycemic State. <em>Med Clin North Am</em>. 2017.</li>
            <li>Finfer S, et al. (NICE-SUGAR Study Investigators). Intensive versus conventional glucose control in critically ill patients. <em>N Engl J Med</em>. 2009.</li>
            <li>Korytkowski M, et al. American Diabetes Association Clinical Practice Recommendations: Inpatient Care. <em>Diabetes Care</em>. 2024.</li>
          </ul>
        </div>
      </div>
  );
}
