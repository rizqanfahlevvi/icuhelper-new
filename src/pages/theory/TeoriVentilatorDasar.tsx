import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion } from '../../components/ui/Accordion';

export default function TeoriVentilatorDasar() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/theory" className="hover:text-primary transition-colors">Teori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Ventilator Dasar</span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-4">
          Mode Ventilator Dasar
        </h1>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-foreground mb-6 text-[13px]">
          <p className="text-muted-foreground">
            <strong className="text-primary font-bold text-[14px]">Pemahaman Mode Ventilator</strong> mekanik dasar adalah esensial untuk dokter di ICU dan IGD. Ventilasi mekanik bukan sekadar meniupkan udara, namun mengatur interaksi kompleks antara mesin dan pernapasan spontan pasien.
          </p>
        </div>

        <Accordion title="⚙️ Konsep Dasar Variabel Ventilator" defaultOpen={true}>
          <p className="text-[12px] text-muted-foreground mb-3">Setiap siklus napas pada ventilator diatur oleh empat variabel fase:</p>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Trigger:</strong> Apa yang memulai napas (Waktu/Mesin, Tekanan/Pasien, Flow/Pasien).</li>
            <li><strong className="text-foreground">Limit:</strong> Batasan maksimal selama inspirasi (Target volume atau tekanan).</li>
            <li><strong className="text-foreground">Cycle:</strong> Apa yang mengakhiri inspirasi dan memulai ekspirasi (Volume, Waktu, atau Flow turun).</li>
            <li><strong className="text-foreground">Baseline:</strong> Tekanan dasar yang tersisa saat ekspirasi (PEEP - Positive End-Expiratory Pressure).</li>
          </ul>
        </Accordion>

        <Accordion title="🌬️ Mode Kontrol Penuh (CMV - Continuous Mandatory Ventilation)">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <p className="text-[12px] text-destructive font-medium">Semua napas diatur oleh mesin, baik dipicu (trigger) oleh pasien maupun oleh waktu (mesin).</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="border border-border p-4 rounded-lg bg-muted/20">
              <h4 className="font-bold text-primary text-[13px] mb-2 border-b border-border pb-1">Volume Control (VC-CMV)</h4>
              <p className="text-[12px] text-muted-foreground mb-2">Mesin memberikan Volume Tidal (Vt) yang tetap. Tekanan jalan napas akan bervariasi bergantung pada compliance (keregangan) dan resistensi paru.</p>
              <ul className="list-disc pl-5 mt-2 text-[12px] text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Target:</strong> Volume konstan, Flow konstan.</li>
                <li><strong className="text-foreground">Risiko:</strong> Barotrauma bila tekanan (PIP) terlalu tinggi.</li>
                <li><strong className="text-foreground">Penggunaan:</strong> Pasien apneu total, ARDS awal (kontrol volume ketat).</li>
              </ul>
            </div>
            <div className="border border-border p-4 rounded-lg bg-muted/20">
              <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-[13px] mb-2 border-b border-border pb-1">Pressure Control (PC-CMV)</h4>
              <p className="text-[12px] text-muted-foreground mb-2">Mesin memberikan Tekanan Inspirasi (Pinsp) yang tetap selama waktu inspirasi tertentu. Volume Tidal akan bervariasi bergantung kondisi paru.</p>
              <ul className="list-disc pl-5 mt-2 text-[12px] text-muted-foreground space-y-1">
                <li><strong className="text-foreground">Target:</strong> Tekanan konstan, Flow deselerasi.</li>
                <li><strong className="text-foreground">Risiko:</strong> Hipoventilasi/Volutrauma jika compliance paru tiba-tiba berubah.</li>
                <li><strong className="text-foreground">Penggunaan:</strong> ARDS berat, neonatus, kebocoran udara (fistula).</li>
              </ul>
            </div>
          </div>
        </Accordion>

        <Accordion title="🔄 Mode Sinkronisasi Intermiten (SIMV)">
          <h4 className="font-bold text-foreground text-[13px] mb-2">Synchronized Intermittent Mandatory Ventilation</h4>
          <p className="text-[12px] text-muted-foreground mb-3">Mesin memberikan napas kontrol (mandatory) secara periodik, tetapi di sela-sela napas tersebut, pasien <strong className="text-foreground font-semibold">BISA</strong> bernapas spontan. Napas mesin disinkronkan dengan usaha napas pasien.</p>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Tujuan:</strong> Mencegah atrofi otot pernapasan, sering digunakan untuk weaning parsial (meskipun sekarang mulai ditinggalkan untuk weaning).</li>
            <li><strong className="text-foreground">Kombinasi:</strong> Napas spontan biasanya dibantu dengan Pressure Support (PS) untuk mengatasi resistensi ETT (SIMV + PS).</li>
          </ul>
        </Accordion>

        <Accordion title="🫁 Mode Spontan Penuh (PSV - Pressure Support Ventilation)">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-foreground mb-4">
            <p className="text-[12px] text-emerald-700 dark:text-emerald-400">Pasien 100% memicu napas. Mesin hanya memberikan "bantuan tekanan" (Pressure Support) saat pasien menarik napas (inspirasi), untuk memudahkan udara masuk dan mengatasi resistensi pipa ETT.</p>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Syarat Utama:</strong> Pasien <strong className="text-destructive">HARUS</strong> memiliki drive napas (trigger) yang adekuat dan stabil.</li>
            <li><strong className="text-foreground">Target Weaning:</strong> Mode ini adalah standar emas untuk proses <i>Spontaneous Breathing Trial</i> (SBT) sebelum ekstubasi.</li>
            <li><strong className="text-foreground">Setting:</strong> PEEP (umumnya 5-8), PS (umumnya 5-15 cmH2O), FiO2.</li>
          </ul>
        </Accordion>

        <Accordion title="📋 Parameter Awal (Initial Setting) yang Disarankan">
          <p className="text-[12px] text-muted-foreground mb-3 italic">Umumnya menggunakan Volume Control (VC) untuk kemudahan di awal (IGD/ICU) bila tidak ada ARDS berat.</p>
          
          <div className="overflow-x-auto mb-2">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-muted text-muted-foreground border-b border-border">
                  <th className="p-2">Parameter</th>
                  <th className="p-2">Rekomendasi Awal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Mode</td><td className="p-2 text-primary font-semibold">VC-CMV atau AC-VC</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Volume Tidal (Vt)</td><td className="p-2">6 - 8 mL/kg dari Ideal Body Weight (IBW). <span className="text-destructive font-medium italic">Bukan berat aktual!</span></td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">Respiratory Rate (RR)</td><td className="p-2">12 - 16 x/menit (targetkan Minute Volume ~ 6-8 L/min)</td></tr>
                <tr className="border-b border-border text-foreground"><td className="p-2 font-bold">FiO₂</td><td className="p-2">Mulai 100% saat intubasi, titrasi turun segera targetkan SpO₂ 92-96%</td></tr>
                <tr className="text-foreground"><td className="p-2 font-bold">PEEP</td><td className="p-2">Mulai 5 cmH₂O. Naikkan bila pasien butuh FiO₂ tinggi (&gt;50%)</td></tr>
              </tbody>
            </table>
          </div>
        </Accordion>

        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ol className="list-decimal pl-5 text-xs text-muted-foreground space-y-1.5">
            <li>Tobin, M. J. (2013). <i>Principles and practice of mechanical ventilation</i>. McGraw-Hill Education.</li>
            <li>Chatburn, R. L., et al. (2014). Respiratory care equipment. <i>Jones &amp; Bartlett Learning</i>.</li>
            <li>Hess, D. R., &amp; MacIntyre, N. R. (2011). <i>Mechanical ventilation</i>. Jones &amp; Bartlett Learning.</li>
            <li>Esteban, A., et al. (2013). Evolution of mechanical ventilation in response to clinical research. <i>American journal of respiratory and critical care medicine</i>, 188(5), 562-569.</li>
            <li>Perhimpunan Dokter Spesialis Anestesiologi dan Terapi Intensif Indonesia (PERDATIN). (2020). <i>Panduan Penggunaan Ventilator</i>.</li>
            <li>The Acute Respiratory Distress Syndrome Network. (2000). Ventilation with lower tidal volumes as compared with traditional tidal volumes for acute lung injury and the acute respiratory distress syndrome. <i>New England Journal of Medicine</i>, 342(18), 1301-1308.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
