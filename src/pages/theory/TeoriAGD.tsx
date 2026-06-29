import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion } from '../../components/ui/Accordion';

export default function TeoriAGD() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/theory" className="hover:text-primary transition-colors">Teori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">AGD</span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-4">
          Interpretasi Analisa Gas Darah (AGD)
        </h1>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-foreground mb-6 text-[13px]">
          <p className="text-muted-foreground">
            <strong className="text-primary font-bold text-[14px]">Analisa Gas Darah (AGD)</strong> adalah pemeriksaan penting untuk mengevaluasi pertukaran gas pulmonal dan status asam-basa (pH) sistemik pasien. Interpretasi yang akurat diperlukan untuk menuntun resusitasi dan penyesuaian ventilator.
          </p>
        </div>

        <Accordion title="🩸 Nilai Normal AGD (Arteri)" defaultOpen={true}>
          <div className="overflow-x-auto mb-2">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Parameter</th>
                  <th className="p-2">Nilai Normal</th>
                  <th className="p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">pH</td><td className="p-2">7.35 - 7.45</td><td className="p-2 text-muted-foreground">&lt; 7.35 <span className="text-destructive font-semibold">Asidemia</span>, &gt; 7.45 <span className="text-warning font-semibold">Alkalemia</span></td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">PaCO₂</td><td className="p-2">35 - 45 mmHg</td><td className="p-2 text-muted-foreground">Komponen respiratorik</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">HCO₃⁻</td><td className="p-2">22 - 26 mEq/L</td><td className="p-2 text-muted-foreground">Komponen metabolik</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">PaO₂</td><td className="p-2">80 - 100 mmHg</td><td className="p-2 text-muted-foreground">Status oksigenasi (&lt;80 hipoksemia)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">SaO₂</td><td className="p-2">&gt; 95%</td><td className="p-2 text-muted-foreground">Saturasi oksigen arteri</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">Base Excess (BE)</td><td className="p-2">-2 hingga +2 mEq/L</td><td className="p-2 text-muted-foreground">Defisit/kelebihan basa</td></tr>
              </tbody>
            </table>
          </div>
        </Accordion>

        <Accordion title="🔢 Langkah Interpretasi Asam-Basa">
          <ul className="list-decimal pl-5 space-y-3 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Lihat pH (Status Asam-Basa):</strong> Apakah pasien <span className="text-destructive font-semibold">asidemia</span> (pH &lt; 7.35) atau <span className="text-warning font-semibold">alkalemia</span> (pH &gt; 7.45)?</li>
            <li><strong className="text-foreground">Tentukan Primer (Respiratorik vs Metabolik):</strong> Perhatikan nilai PaCO₂ dan HCO₃⁻. Gangguan primer searah dengan deviasi pH.
              <ul className="list-disc pl-5 mt-2 space-y-1 bg-muted/30 p-3 rounded-lg border border-border">
                <li><strong className="text-foreground">Asidosis Respiratorik:</strong> pH ↓, PaCO₂ ↑</li>
                <li><strong className="text-foreground">Asidosis Metabolik:</strong> pH ↓, HCO₃⁻ ↓</li>
                <li><strong className="text-foreground">Alkalosis Respiratorik:</strong> pH ↑, PaCO₂ ↓</li>
                <li><strong className="text-foreground">Alkalosis Metabolik:</strong> pH ↑, HCO₃⁻ ↑</li>
              </ul>
            </li>
            <li><strong className="text-foreground">Evaluasi Kompensasi:</strong> Apakah sistem lain (ginjal untuk paru, atau paru untuk ginjal) sudah berusaha menyeimbangkan pH?
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="text-foreground">Tidak terkompensasi:</strong> Komponen sekunder normal.</li>
                <li><strong className="text-foreground">Terkompensasi parsial:</strong> Komponen sekunder abnormal ke arah yang berlawanan, namun pH belum kembali normal.</li>
                <li><strong className="text-foreground">Terkompensasi penuh:</strong> Komponen sekunder abnormal, pH kembali normal (antara 7.35 - 7.45, namun lebih condong ke arah primer).</li>
              </ul>
            </li>
          </ul>
        </Accordion>

        <Accordion title="⚖️ Anion Gap (Pada Asidosis Metabolik)">
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground mb-4">
            <p className="text-[12px] text-muted-foreground">Jika terjadi <strong className="text-foreground">Asidosis Metabolik</strong>, wajib menghitung Anion Gap (AG) untuk mengetahui penyebabnya.</p>
            <div className="mt-2 font-mono text-[13px] text-warning font-bold">
              AG = Na⁺ - (Cl⁻ + HCO₃⁻) <br/>
              <span className="text-muted-foreground font-normal">Normal AG: 8 - 12 mEq/L</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-3">
              <h4 className="font-bold text-destructive text-[13px] mb-2">High Anion Gap (MUDPILES)</h4>
              <p className="text-[12px] text-muted-foreground">Methanol, Uremia, DKA (Ketoasidosis Diabetik), Paraldehyde, Iron/Isoniazid, Lactic acidosis, Ethylene glycol, Salicylates.</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <h4 className="font-bold text-primary text-[13px] mb-2">Normal Anion Gap (HARDUP)</h4>
              <p className="text-[12px] text-muted-foreground">Hyperalimentation, Acetazolamide, Renal tubular acidosis, Diarrhea, Uretero-pelvic shunt, Post-hypocapnia.</p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 italic">*Catatan: Bila albumin rendah, hitung Corrected Anion Gap: AG terukur + 2.5(4.5 - Albumin pasien).</p>
        </Accordion>

        <Accordion title="🫁 Evaluasi Oksigenasi">
          <p className="text-[12px] text-muted-foreground mb-3">Interpretasi tidak lengkap tanpa melihat status oksigenasi dari PaO₂ dan P/F ratio (PaO₂/FiO₂).</p>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Kondisi</th>
                  <th className="p-2">PaO₂ (mmHg)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-primary">Normal (Room Air 21%)</td><td className="p-2">80 - 100</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-warning">Hipoksemia Ringan</td><td className="p-2">60 - 79</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold text-orange-500">Hipoksemia Sedang</td><td className="p-2">40 - 59</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold text-destructive">Hipoksemia Berat</td><td className="p-2">&lt; 40</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-[12px]">
            <strong className="text-foreground">PF Ratio (PaO₂ / FiO₂ ratio):</strong><br/>
            <span className="text-muted-foreground">Normal &gt; 400. Kriteria ARDS (Berlin): &lt; 300 (Ringan), &lt; 200 (Sedang), &lt; 100 (Berat).</span>
          </div>
        </Accordion>

        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground text-[12px]">
            <li>Kaufman, D. A. (2020). <i>Interpretation of Arterial Blood Gases (ABGs)</i>. American Thoracic Society.</li>
            <li>Larkin, B. G., &amp; Zimko, W. T. (2015). Acid-base balance and oxygenation. <i>AORN journal</i>, 101(4), 441-456.</li>
            <li>Seifter, J. L. (2014). Integration of acid-base and electrolyte disorders. <i>New England Journal of Medicine</i>, 371(19), 1821-1831.</li>
            <li>Kraut, J. A., &amp; Madias, N. E. (2007). Serum anion gap: its uses and limitations in clinical medicine. <i>Clinical journal of the American Society of Nephrology</i>, 2(1), 162-174.</li>
            <li>Perhimpunan Dokter Spesialis Anestesiologi dan Terapi Intensif Indonesia (PERDATIN). (2020). <i>Pedoman Pelayanan ICU</i>.</li>
            <li>The ARDS Definition Task Force. (2012). Acute Respiratory Distress Syndrome: The Berlin Definition. <i>JAMA</i>, 307(23), 2526-2533.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
