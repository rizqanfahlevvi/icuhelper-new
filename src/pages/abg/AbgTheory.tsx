import { Accordion } from '../../components/ui/Accordion';

export default function AbgTheory() {
  return (
    <div className="space-y-4 pb-16">
      <h2 className="text-xl font-bold tracking-tight text-foreground mt-8">Teori & Referensi ABG</h2>

      <Accordion title="📖 Nilai Normal ABG Dewasa & Fisiologi Henderson-Hasselbalch">
        <div className="overflow-x-auto -mx-3 sm:mx-0 mb-4">
          <div className="min-w-[500px] p-3 pt-0">
            <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Nilai Normal ABG Dewasa</h3>
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Parameter</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Nilai Normal</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Satuan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-2">pH</td><td className="p-2">7.35–7.45</td><td className="p-2">—</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">PaCO₂</td><td className="p-2">35–45</td><td className="p-2">mmHg</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">PaO₂</td><td className="p-2">80–100</td><td className="p-2">mmHg (menurun dengan usia)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">HCO₃⁻</td><td className="p-2">22–26</td><td className="p-2">mEq/L</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">BE (Base Excess)</td><td className="p-2">-2 s/d +2</td><td className="p-2">mEq/L</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">SpO₂ / SaO₂</td><td className="p-2">95–100%</td><td className="p-2">—</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Laktat</td><td className="p-2">&lt;2.0</td><td className="p-2">mmol/L</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Anion Gap</td><td className="p-2">8–12 (corrected 10–14)</td><td className="p-2">mEq/L</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">Persamaan Henderson-Hasselbalch</h3>
        <p className="text-[12px] font-mono text-foreground mb-3 bg-muted/30 p-2 rounded border border-border">pH = 6.1 + log([HCO₃⁻] / (0.0307 × PaCO₂))</p>
        <p className="text-[12px] text-muted-foreground mb-2">Sistem buffer bikarbonat adalah buffer ekstraseluler utama. CO₂ larut dalam darah sebagai H₂CO₃ (asam karbonat) yang dikontrol oleh paru, sedangkan HCO₃⁻ dikontrol oleh ginjal.</p>
        <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
          <li><strong className="text-foreground">Paru:</strong> Regulasi cepat (menit) — hiperventilasi turunkan PaCO₂ → ↑ pH</li>
          <li><strong className="text-foreground">Ginjal:</strong> Regulasi lambat (jam-hari) — retensi/ekskresi HCO₃⁻</li>
          <li><strong className="text-foreground">BE (Base Excess):</strong> Jumlah asam/basa (mEq/L) yang dibutuhkan untuk mengembalikan pH ke 7.4 pada kondisi standar. Mencerminkan komponen metabolik murni.</li>
        </ul>
        <p className="text-[11px] opacity-80 text-orange-700 dark:text-orange-300 italic">📚 Henderson LJ. Am J Physiol 1908 · Hasselbalch KA. Biochem Z 1916 · Severinghaus JW. J Appl Physiol 1966 · Siggaard-Andersen O. Scand J Clin Lab Invest 1963</p>
      </Accordion>

      <Accordion title="📖 Kompensasi Respiratorik & Metabolik — Formula Lengkap">
        <div className="overflow-x-auto -mx-3 sm:mx-0 mb-4">
          <div className="min-w-[500px] p-3 pt-0">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Gangguan Primer</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Formula Kompensasi</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Batas Kompensasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-2">Asidosis Respiratorik Akut</td><td className="p-2 font-mono text-[11px]">ΔHCO₃⁻ = 0.1 × ΔPaCO₂ (±2)</td><td className="p-2">HCO₃⁻ max ~30</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Asidosis Respiratorik Kronik (≥3-5 hr)</td><td className="p-2 font-mono text-[11px]">ΔHCO₃⁻ = 0.35 × ΔPaCO₂ (±3)</td><td className="p-2">HCO₃⁻ max ~45</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Alkalosis Respiratorik Akut</td><td className="p-2 font-mono text-[11px]">ΔHCO₃⁻ = 0.2 × ΔPaCO₂ (±2.5)</td><td className="p-2">HCO₃⁻ min ~18</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Alkalosis Respiratorik Kronik</td><td className="p-2 font-mono text-[11px]">ΔHCO₃⁻ = 0.5 × ΔPaCO₂ (±2.5)</td><td className="p-2">HCO₃⁻ min ~12–15</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Asidosis Metabolik</td><td className="p-2 font-mono text-[11px]">Exp PaCO₂ = (1.5 × HCO₃⁻) + 8 ± 2</td><td className="p-2">PaCO₂ min ~8–10</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Alkalosis Metabolik</td><td className="p-2 font-mono text-[11px]">Exp PaCO₂ = (0.7 × HCO₃⁻) + 21 ± 2</td><td className="p-2">PaCO₂ max ~55–60</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <ul className="list-disc pl-5 mb-3 space-y-1 text-muted-foreground text-[12px]">
          <li><strong className="text-foreground">Interpretasi kompensasi:</strong> Jika actual berbeda dari expected → mixed disorder. Contoh: asidosis metabolik dengan PaCO₂ actual lebih tinggi dari expected Winter's → concurrent respiratory acidosis.</li>
          <li><strong className="text-foreground">Kompensasi tidak pernah melampaui normal:</strong> pH tidak kembali normal kecuali ada mixed disorder. Jika pH normal dengan HCO₃⁻ dan PaCO₂ abnormal → kemungkinan mixed disorder saling mengkompensasi.</li>
          <li><strong className="text-foreground">Akut vs Kronik:</strong> PPOK kronik dengan retensi CO₂ sudah terkompensasi (HCO₃⁻ tinggi, pH relatif normal). Jangan agresif normalisasi PaCO₂ — risiko alkalosis metabolik berat post-ventilasi.</li>
        </ul>
        <p className="text-[11px] opacity-80 text-orange-700 dark:text-orange-300 italic">📚 Winter SD. Ann Intern Med 1967 · Narins RG. Medicine 1980 · Feldman M. NEJM 2015</p>
      </Accordion>

      <Accordion title="📖 P/F Ratio, A-a Gradient, OI & ROX Index">
        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">P/F Ratio (PaO₂/FiO₂)</h3>
        <div className="overflow-x-auto -mx-3 sm:mx-0 mb-4">
          <div className="min-w-[400px] p-3 pt-0">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">P/F Ratio</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Klasifikasi</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-2">≥400</td><td className="p-2 text-success">Normal</td><td className="p-2">Oksigenasi adekuat</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">300–400</td><td className="p-2 text-success">Hipoksemia ringan</td><td className="p-2">Waspada</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">200–300</td><td className="p-2 text-warning">ARDS Mild</td><td className="p-2">PEEP ≥5 cmH₂O</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">100–200</td><td className="p-2 text-destructive">ARDS Moderate</td><td className="p-2">Lung-protective wajib</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">&lt;100</td><td className="p-2 text-destructive">ARDS Severe</td><td className="p-2">Prone, ECMO pertimbangkan</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">A-a Gradient (Alveolar-arterial O₂ Difference)</h3>
        <p className="text-[12px] text-muted-foreground mb-1"><strong className="text-foreground">PAO₂ = FiO₂ × (Patm − PH₂O) − PaCO₂/RQ</strong></p>
        <p className="text-[12px] text-muted-foreground mb-2">Pada udara ruang: PAO₂ = 150 − PaCO₂/0.8<br/><strong>A-a gradient = PAO₂ − PaO₂</strong> · Normal: (Usia/4 + 4) atau ≤10 mmHg (muda)</p>
        <div className="overflow-x-auto -mx-3 sm:mx-0 mb-4">
          <div className="min-w-[400px] p-3 pt-0">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">A-a Gradient</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">PaCO₂</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Interpretasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-2">Normal</td><td className="p-2">Normal</td><td className="p-2">Tidak ada gangguan pertukaran gas</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Normal</td><td className="p-2">Tinggi (↑)</td><td className="p-2">Hipoventilasi murni (drive ↓, NMD)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Meningkat</td><td className="p-2">Normal/Rendah</td><td className="p-2">V/Q mismatch, shunt (pneumonia/ARDS)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">Meningkat</td><td className="p-2">Tinggi</td><td className="p-2">V/Q mismatch berat + hipoventilasi</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3 className="font-bold text-[13px] text-primary uppercase tracking-wider mb-2 border-b border-border pb-1">ROX Index (untuk HFNC)</h3>
        <p className="text-[12px] text-muted-foreground mb-2"><strong className="text-foreground">ROX = (SpO₂/FiO₂) / RR spontan</strong></p>
        <div className="overflow-x-auto -mx-3 sm:mx-0 mb-3">
          <div className="min-w-[400px] p-3 pt-0">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">ROX</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Interpretasi</th>
                  <th className="p-2 border-b border-border font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50"><td className="p-2">≥4.88</td><td className="p-2 text-success">HFNC sukses</td><td className="p-2">Lanjutkan HFNC</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">3.85–4.88</td><td className="p-2 text-warning">Borderline</td><td className="p-2">Evaluasi ketat 2-6 jam</td></tr>
                <tr className="border-b border-border/50"><td className="p-2">&lt;3.85</td><td className="p-2 text-destructive">Risiko gagal tinggi</td><td className="p-2">Pertimbangkan intubasi</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-[11px] opacity-80 text-orange-700 dark:text-orange-300 italic">📚 ARDSNet. NEJM 2000 · Berlin Definition. JAMA 2012 · Roca O. AJRCCM 2016 (ROX)</p>
      </Accordion>
    </div>
  );
}
