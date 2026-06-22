import { Accordion } from '../../components/ui/Accordion';

export default function TeoriNutrisi() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
          Nutrisi ICU — Strategi, Target & Monitoring
        </h1>
        
        <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg text-foreground mb-4 text-[13px]">
          <div className="font-bold text-[15px] mb-2 text-orange-600 dark:text-orange-400">🥗 Konsep Dasar Nutrisi ICU — Hindari Under- DAN Over-Feeding</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-bold text-foreground mb-1">Mengapa nutrisi kritis penting?</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground text-[12px]">
                <li>Muscle wasting ICU: <strong className="text-foreground">1–2%/hari</strong> tanpa nutrisi adekuat → kelemahan otot berminggu–bulan pasca ICU</li>
                <li><strong className="text-foreground">PICS</strong> (Post-Intensive Care Syndrome): gangguan fisik (kelemahan), kognitif (memori), dan psikologis (PTSD, depresi) setelah rawat ICU</li>
                <li>Under-feeding: katabolisme tak terkendali, infeksi ↑, penyembuhan terlambat, weaning sulit</li>
                <li>Over-feeding: hiperkarbia (sulit weaning), hiperglikemia, hipertrigliseridemia, NAFLD</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-foreground mb-1">Fase Metabolik di ICU:</p>
              <table className="w-full text-left border-collapse text-[12px]">
                <thead><tr className="bg-muted text-muted-foreground border-b border-border"><th className="p-1">Fase</th><th className="p-1">Waktu</th><th className="p-1">Target Kalori</th></tr></thead>
                <tbody>
                  <tr className="border-b border-border"><td className="p-1 font-bold text-foreground">Acute Early</td><td className="p-1 text-muted-foreground">0–48 jam</td><td className="p-1 text-warning">50–70% target</td></tr>
                  <tr className="border-b border-border"><td className="p-1 font-bold text-foreground">Acute Late</td><td className="p-1 text-muted-foreground">48 jam–7 hari</td><td className="p-1 text-success">70–100% target</td></tr>
                  <tr><td className="p-1 font-bold text-foreground">Recovery</td><td className="p-1 text-muted-foreground">&gt;7 hari</td><td className="p-1 text-primary">100–125% target</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-2 text-[11px] opacity-80 text-orange-700 dark:text-orange-300"><em>Berdasarkan ESPEN Critically Ill Nutrition Guidelines 2023 dan ASPEN/SCCM 2022 [1, 2].</em></p>
        </div>

        </div>

        <Accordion title="📖 Target Kalori & Protein" defaultOpen={true}>
          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target Kalori Harian</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kondisi / Waktu</th><th className="p-2">Target Kalori</th><th className="p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Fase akut 0–48 jam</td><td className="p-2 text-warning font-semibold">50–70% target (10–15 kkal/kg/hari)</td><td className="p-2 text-muted-foreground">Avoid over-feeding; endogenous catabolism masih bermakna</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Setelah 48 jam (stabil)</td><td className="p-2 text-success font-semibold">25–30 kkal/kg IBW/hari</td><td className="p-2 text-muted-foreground">Gunakan IBW (Ideal Body Weight), bukan actual BW pada obese</td>
                </tr>
                <tr className="border-b border-border text-foreground">
                  <td className="p-2 font-bold">Obesitas (BMI ≥30)</td><td className="p-2">11–14 kkal/kg actual BW <br/>(atau 22–25 kkal/kg IBW)</td><td className="p-2 text-muted-foreground">Hypocaloric high-protein feeding — hindari overfeeding</td>
                </tr>
                <tr className="text-foreground">
                  <td className="p-2 font-bold">Malnutrisi berat / refeeding</td><td className="p-2">Mulai 10–20 kkal/kg/hari</td><td className="p-2 text-muted-foreground">Naik bertahap 3-5 hari. Pantau fosfat/K/Mg ketat</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[12px] text-muted-foreground"><strong>Formula estimasi:</strong> Dapat menggunakan Harris-Benedict dgn faktor stres, namun Indirect Calorimetry (IC) adalah Gold Standard.</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Target Protein Harian</h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kondisi</th><th className="p-2">Target Protein</th><th className="p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">ICU umum (non-obese)</td><td className="p-2 text-primary font-bold">1.2–2.0 g/kg IBW/hari</td><td className="p-2 text-muted-foreground">Mulai 1.2, eskalasi bertahap</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Obesitas (BMI ≥30)</td><td className="p-2 text-primary font-bold">2.0–2.5 g/kg IBW/hari</td><td className="p-2 text-muted-foreground">Protein tinggi untuk preservasi lean mass</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Luka bakar (&gt;30% BSA)</td><td className="p-2 font-semibold">2.0–2.5 g/kg/hari</td><td className="p-2 text-muted-foreground">Hiperkatabolisme ekstrem</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">AKI tanpa dialisis</td><td className="p-2 text-warning font-semibold">0.8–1.0 g/kg/hari</td><td className="p-2 text-muted-foreground">Batasi protein untuk kurangi uremia</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">CRRT (CVVH/CVVHDF)</td><td className="p-2 text-destructive font-bold">1.5–2.0 g/kg/hari</td><td className="p-2 text-muted-foreground">Kehilangan asam amino via membran ~10–15 g/hari</td></tr>
              </tbody>
            </table>
          </div>
        </Accordion>

        <Accordion title="📖 Enteral vs Parenteral — Kapan, Bagaimana & Monitoring">
          <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-foreground mb-4 text-center">
            <strong className="text-success text-[14px]">🏥 Prinsip Utama: "If the gut works, use it!"</strong>
            <p className="text-muted-foreground mt-1 text-[12px]">Nutrisi enteral mempertahankan integritas mukosa usus, mencegah translokasi bakteri, dan lebih fisiologis. Parenteral hanya jika enteral tidak mungkin atau tidak mencukupi.</p>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Waktu Mulai Enteral Nutrition (EN)</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground text-[12px]">
            <li><strong className="text-foreground">ICU umum, stabil hemodinamik:</strong> &lt;24–48 jam. (MAP ≥65 tanpa eskalasi vasopressor masif)</li>
            <li><strong className="text-foreground">Syok aktif:</strong> Tunda hingga stabil (risiko non-occlusive mesenteric ischemia)</li>
            <li><strong className="text-foreground">Posisi kepala (HOB):</strong> 30–45° SELALU saat enteral feeding untuk mencegah aspirasi.</li>
            <li><strong className="text-foreground">Pasca Operasi GI Elektif:</strong> Early EN aman meski belum bising usus.</li>
          </ul>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Monitoring Toleransi & Kontraindikasi Absolut EN</h3>
          <p className="text-[12px] mb-2 text-foreground font-semibold">Kontraindikasi: Obstruksi usus mekanis total, Iskemia usus, Abdominal compartment syndrome.</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Tanda Intoleransi</th><th className="p-2">Ambang Klinis</th><th className="p-2">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Gastric Residual Vol. (GRV)</td><td className="p-2 text-destructive font-bold">&gt;500 mL/6 jam</td><td className="p-2 text-muted-foreground">Pause 1–2 jam, coba prokinetik (Metoklopramid / Eritromisin). (Update ESPEN: ambang naik 500mL bukan lg 200mL).</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Diare</td><td className="p-2">&gt;3 defekasi cair/hari</td><td className="p-2 text-muted-foreground">Singkirkan C.diff, kurangi rate, beri formula fiber.</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Kapan Mulai Parenteral Nutrition (PN)?</h3>
          <p className="text-[12px] text-muted-foreground mb-4">Mulai PN setelah 24–48 jam/segera jika EN kontraindikasi (pada px malnutrisi). SPN (Supplemental PN) bila EN mencapai &lt;60% target di hari ke-3–5.</p>
        </Accordion>

        <Accordion title="📖 Refeeding Syndrome — Risiko, Patofisiologi & Pencegahan">
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground mb-4">
            <h3 className="font-bold text-[14px] text-warning mb-1">⚠️ Refeeding Syndrome</h3>
            <p className="text-[12px] text-muted-foreground mb-2">Terjadi ketika pemberian nutrisi (terutama KH) terlalu cepat setelah puasa panjang. Insulin surge → K, Mg, Phos masuk sel drastis → hipofosfatemia, hipokalemia akut → aritmia, RF, kematian.</p>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong className="text-foreground">Risiko (NICE):</strong> BMI rendah (&lt;16), anoriksia, NPO &gt;5-10 hari.</li>
              <li><strong className="text-foreground">Pencegahan:</strong> Tiamin 200-300mg IV SEBELUM mulai makan, mulai 10-20 kkal/kg pelan, evaluasi posfat, K, Mg harian.</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="📖 PICS & Rehabilitasi Nutrisi Pasca ICU">
          <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-foreground mb-4">
            <strong className="text-teal-600 dark:text-teal-400 block mb-1 font-bold text-[14px]">🔄 PICS — Post-Intensive Care Syndrome</strong>
            <p className="text-muted-foreground text-[12px] mb-2">Gangguan fisik, kognitif, atau kesehatan mental yang muncul setelah rawat di ICU.</p>
            <ul className="list-disc pl-5 m-0 space-y-1 text-muted-foreground text-[12px]">
              <li><strong>Pasca ICU (Pemulihan):</strong> Target protein meningkat ke <strong>1.5–2.0 g/kg/hari</strong> dan kalori ke 100-125% [4].</li>
              <li>Berikan <strong>ONS (Oral Nutritional Supplements)</strong> jika intake tidak kuat.</li>
              <li>Sinergikan dengan Early Mobility dan Physiotherapy untuk re-sintesis lean body mass [5].</li>
            </ul>
          </div>
        </Accordion>

        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ul className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Singer P, et al. ESPEN practical guideline: Clinical nutrition in the intensive care unit. <em>Clin Nutr</em>. 2023.</li>
            <li>McClave SA, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient: SCCM and ASPEN. <em>JPEN</em>. 2016 (Update 2022).</li>
            <li>Friedli N, et al. Management and prevention of refeeding syndrome in medical inpatients: An evidence-based and consensus-supported algorithm. <em>Nutrition</em>. 2018.</li>
            <li>Needham DM, et al. Physical medicine and rehabilitation interventions in the intensive care unit: a call for action. <em>Am J Phys Med Rehabil</em>. 2010.</li>
            <li>Herridge MS, et al. One-year outcomes in survivors of the acute respiratory distress syndrome. <em>N Engl J Med</em>. 2003.</li>
          </ul>
        </div>
      </div>
  );
}
