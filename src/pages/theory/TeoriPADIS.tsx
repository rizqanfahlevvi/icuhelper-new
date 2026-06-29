import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion } from '../../components/ui/Accordion';

export default function TeoriPADIS() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/theory" className="hover:text-primary transition-colors">Teori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">PADIS Guideline</span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-4">
          Guideline PADIS (2018)
        </h1>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-foreground mb-6 text-[13px]">
          <p className="text-muted-foreground">
            <strong className="text-primary font-bold text-[14px]">Panduan PADIS</strong> <i>(Pain, Agitation/Sedation, Delirium, Immobility, and Sleep Disruption)</i> yang dikeluarkan oleh SCCM pada tahun 2018 merupakan standar perawatan terkini bagi pasien dewasa di ICU. Prinsip utamanya adalah menilai dan mengobati nyeri terlebih dahulu sebelum memberikan sedasi <i>(Analgesia-first sedation)</i>.
          </p>
        </div>

        <Accordion title="1️⃣ Nyeri (Pain)" defaultOpen={true}>
          <p className="text-[12px] text-muted-foreground mb-3">Pasien ICU berisiko tinggi mengalami nyeri, baik dari penyakit dasar maupun prosedur rutin.</p>
          <ul className="list-disc pl-5 space-y-3 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Asesmen:</strong> Gunakan NRS (Numeric Rating Scale) untuk pasien sadar, atau BPS <i>(Behavioral Pain Scale)</i> / CPOT <i>(Critical-Care Pain Observation Tool)</i> untuk pasien dengan ventilasi mekanik / tidak dapat berkomunikasi.</li>
            <li><strong className="text-foreground">Tatalaksana (Analgesia-first):</strong> 
              <ul className="list-disc pl-5 mt-2 space-y-1 bg-muted/30 p-3 rounded-lg border border-border">
                <li><strong className="text-foreground">Opioid IV</strong> (Fentanyl, Morfin) adalah obat lini pertama untuk nyeri non-neuropatik.</li>
                <li><strong className="text-foreground">Multimodal analgesia:</strong> Gunakan analgesia non-opioid (Parasetamol, Ketamin dosis rendah, Gabapentin/Pregabalin untuk nyeri neuropatik) untuk mengurangi dosis opioid.</li>
              </ul>
            </li>
          </ul>
        </Accordion>

        <Accordion title="2️⃣ Agitasi & Sedasi (Agitation/Sedation)">
          <p className="text-[12px] text-muted-foreground mb-3">Tujuan sedasi modern adalah mencapai level sedasi ringan (pasien tenang namun mudah dibangunkan) kecuali ada indikasi khusus (seperti status epileptikus atau TIK tinggi).</p>
          <ul className="list-disc pl-5 space-y-3 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Asesmen:</strong> Gunakan RASS <i>(Richmond Agitation-Sedation Scale)</i> atau SAS <i>(Sedation-Agitation Scale)</i>. Target RASS umumnya <strong className="text-primary">0 hingga -2</strong>.</li>
            <li><strong className="text-foreground">Tatalaksana:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1 bg-muted/30 p-3 rounded-lg border border-border">
                <li>Disarankan menggunakan sedatif <strong className="text-foreground">non-benzodiazepin</strong> (Propofol atau Dexmedetomidine) dibandingkan Benzodiazepin (Midazolam) untuk mengurangi risiko delirium dan durasi ventilasi mekanik.</li>
                <li>Lakukan <strong className="text-foreground">Daily Sedation Interruption (DSI)</strong> / Spontaneous Awakening Trial (SAT) untuk membangunkan pasien setiap hari dan menilai kebutuhan sedasi.</li>
              </ul>
            </li>
          </ul>
        </Accordion>

        <Accordion title="3️⃣ Delirium">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <p className="text-[12px] text-destructive">Delirium adalah disfungsi otak akut yang sering terjadi di ICU, terkait dengan peningkatan mortalitas dan disfungsi kognitif jangka panjang.</p>
          </div>
          
          <ul className="list-disc pl-5 space-y-3 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Asesmen:</strong> Evaluasi rutin menggunakan CAM-ICU <i>(Confusion Assessment Method for the ICU)</i> atau ICDSC.</li>
            <li><strong className="text-foreground">Pencegahan & Tatalaksana (Non-farmakologi adalah kunci):</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1 bg-muted/30 p-3 rounded-lg border border-border">
                <li><strong className="text-foreground">Non-farmakologi:</strong> Promosikan siklus tidur-bangun, mobilisasi dini, penggunaan kacamata/alat bantu dengar pasien, dan kurangi suara bising/cahaya saat malam.</li>
                <li><strong className="text-foreground">Farmakologi:</strong> Saat ini <strong className="text-destructive font-bold">TIDAK ADA</strong> obat profilaksis yang direkomendasikan rutin. Haloperidol atau antipsikotik atipikal hanya digunakan jangka pendek untuk delirium hiperaktif yang membahayakan pasien/staf.</li>
              </ul>
            </li>
          </ul>
        </Accordion>

        <Accordion title="4️⃣ Imobilisasi (Immobility)">
          <p className="text-[12px] text-muted-foreground mb-3">Tirah baring lama memicu <i>ICU-acquired weakness</i> (ICUAW).</p>
          <ul className="list-disc pl-5 space-y-3 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Tatalaksana:</strong> Lakukan mobilisasi / fisioterapi sedini mungkin sesuai toleransi pasien (mulai dari ROM pasif di tempat tidur, duduk di tepi tempat tidur, hingga berjalan).</li>
            <li>Program mobilisasi dini terbukti memperpendek durasi delirium dan hari rawat ICU.</li>
          </ul>
        </Accordion>

        <Accordion title="5️⃣ Gangguan Tidur (Sleep Disruption)">
          <p className="text-[12px] text-muted-foreground mb-3">Kualitas tidur yang buruk di ICU memperburuk delirium dan penyembuhan.</p>
          <ul className="list-disc pl-5 space-y-3 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Protokol Tidur:</strong> Optimalkan lingkungan (matikan lampu, kurangi suara monitor) dan satukan intervensi keperawatan malam hari.</li>
            <li><strong className="text-foreground">Farmakologi:</strong> Propofol tidak menghasilkan "tidur" fisiologis sejati (REM sleep). Hindari penggunaan sedatif hanya untuk membuat pasien tidur.</li>
          </ul>
        </Accordion>

        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ol className="list-decimal pl-5 text-xs text-muted-foreground space-y-1.5">
            <li>Devlin, J. W., Skrobik, Y., Gélinas, C., et al. (2018). Clinical Practice Guidelines for the Prevention and Management of Pain, Agitation/Sedation, Delirium, Immobility, and Sleep Disruption in Adult Patients in the ICU. <i>Critical Care Medicine</i>, 46(9), e825-e873.</li>
            <li>Girard, T. D., Kress, J. P., Fuchs, B. D., et al. (2008). Efficacy and safety of a paired sedation and ventilator weaning protocol for mechanically ventilated patients in intensive care (Awakening and Breathing Controlled trial). <i>The Lancet</i>, 371(9607), 126-134.</li>
            <li>Schweickert, W. D., Pohlman, M. C., Pohlman, A. S., et al. (2009). Early physical and occupational therapy in mechanically ventilated, critically ill patients: a randomised controlled trial. <i>The Lancet</i>, 373(9678), 1874-1882.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
