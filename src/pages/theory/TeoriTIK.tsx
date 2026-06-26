import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion } from '../../components/ui/Accordion';

export default function TeoriTIK() {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link to="/theory" className="hover:text-primary transition-colors">Teori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">TIK</span>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-4">
          Manajemen Peningkatan TIK (ICP)
        </h1>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-foreground mb-6 text-[13px]">
          <p className="text-muted-foreground">
            <strong className="text-primary font-bold text-[14px]">Peningkatan Tekanan Intrakranial (TIK/ICP)</strong> merupakan kegawatdaruratan neurologis yang mengancam nyawa. Peningkatan TIK dapat mengurangi perfusi serebral yang berujung pada iskemia otak dan herniasi.
          </p>
        </div>

        <Accordion title="🧠 Konsep Dasar & Doktrin Monro-Kellie" defaultOpen={true}>
          <p className="text-[12px] text-muted-foreground mb-3">Volume intrakranial bersifat konstan dan terdiri dari tiga komponen: Jaringan Otak (80%), Darah Serebral (10%), dan Cairan Serebrospinal (10%). Peningkatan volume pada salah satu komponen harus dikompensasi oleh penurunan volume komponen lain. Jika kompensasi habis, TIK akan meningkat eksponensial.</p>
          
          <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-foreground mt-3 font-mono text-[13px]">
            <strong className="text-warning block mb-1">Target Hemodinamik Serebral:</strong>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>CPP (Cerebral Perfusion Pressure) = MAP - ICP</li>
              <li><strong className="text-foreground">Target CPP:</strong> 60 - 70 mmHg</li>
              <li><strong className="text-foreground">Normal ICP:</strong> &lt; 15 mmHg (Terapi dimulai bila ICP &gt; 20-22 mmHg)</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="⚠️ Tanda Klinis Peningkatan TIK">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <h4 className="font-bold text-destructive text-[13px] mb-1">Trias Cushing (Tanda Lanjut/Herniasi):</h4>
            <p className="text-[12px] text-destructive">Hipertensi (dengan <i>widened pulse pressure</i>), Bradikardia, dan Pola Napas Irreguler (Kussmaul, Cheyne-Stokes).</p>
          </div>
          
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground">
            <li>Penurunan Kesadaran (GCS menurun).</li>
            <li>Pupil anisokor / tidak reaktif.</li>
            <li>Muntah proyektil, Nyeri kepala hebat (pada pasien sadar).</li>
          </ul>
        </Accordion>

        <Accordion title="⚕️ Tatalaksana Medis Berjenjang (Tiered Therapy)">
          <p className="text-[12px] text-muted-foreground mb-4">Tatalaksana bertujuan menurunkan ICP sekaligus mempertahankan CPP adekuat.</p>
          
          <h4 className="font-bold text-primary text-[13px] uppercase tracking-wider mb-2 border-b border-border pb-1">Tier 1: Tindakan Dasar & Farmakologi Awal</h4>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground mb-4">
            <li><strong className="text-foreground">Elevasi Kepala:</strong> 30 derajat. Posisikan leher netral (tidak fleksi/ekstensi) untuk melancarkan drainase vena jugularis.</li>
            <li><strong className="text-foreground">Oksigenasi & Ventilasi:</strong> Target PaO₂ &gt; 80 mmHg. Pertahankan normokarbia (PaCO₂ 35-40 mmHg). <span className="text-destructive font-medium">Hiperkapnia menyebabkan vasodilatasi serebral yang menaikkan TIK!</span></li>
            <li><strong className="text-foreground">Kontrol Tekanan Darah:</strong> Target MAP untuk mempertahankan CPP 60-70 mmHg. Gunakan vasopresor bila MAP rendah, atau antihipertensi bila MAP sangat tinggi.</li>
            <li><strong className="text-foreground">Sedasi & Analgesia:</strong> Propofol dan Fentanyl sering digunakan. Mengurangi agitasi, nyeri, dan metabolisme otak (CMRO₂).</li>
            <li><strong className="text-foreground">Normotermia:</strong> Obati demam. Demam menaikkan metabolisme otak.</li>
            <li><strong className="text-foreground">Kontrol Kejang:</strong> Profilaksis anti-kejang sesuai indikasi.</li>
          </ul>

          <h4 className="font-bold text-warning text-[13px] uppercase tracking-wider mb-2 border-b border-border pb-1 mt-6">Tier 2: Terapi Osmolar</h4>
          <p className="text-[12px] text-muted-foreground mb-2">Bila ICP tetap tinggi (&gt;20-22 mmHg), berikan terapi hiperosmolar untuk menarik air dari jaringan otak masuk ke intravaskuler.</p>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground mb-4">
            <li><strong className="text-foreground">Manitol 20%:</strong> Dosis 0.5 - 1 g/kgBB IV. Perhatikan status cairan. Tidak disarankan pada pasien hipotensi.</li>
            <li><strong className="text-foreground">Hipertonik Salin (NaCl 3%):</strong> Sangat baik untuk pasien dengan hipotensi atau hiponatremia bersamaan. Target Na serum 145-155 mEq/L.</li>
          </ul>

          <h4 className="font-bold text-destructive text-[13px] uppercase tracking-wider mb-2 border-b border-border pb-1 mt-6">Tier 3: Terapi Refrakter (Penyelamatan)</h4>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Hiperventilasi Singkat:</strong> Turunkan PaCO₂ hingga 30-35 mmHg. Hanya digunakan sementara (bridging ke bedah) saat ada tanda klinis herniasi.</li>
            <li><strong className="text-foreground">Barbiturate Coma:</strong> Mensupresi metabolisme otak secara masif. Risiko tinggi hipotensi.</li>
            <li><strong className="text-foreground">Kraniektomi Dekompresi:</strong> Operasi bedah pengangkatan sebagian tulang tengkorak (terapi definitif jika terapi medis gagal).</li>
          </ul>
        </Accordion>

        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ol className="list-decimal pl-5 text-xs text-muted-foreground space-y-1.5">
            <li>Stevens, R. D., &amp; Shoykhet, M. (2018). Management of elevated intracranial pressure. <i>Neurologic clinics</i>.</li>
            <li>Mokri, B. (2001). The Monro-Kellie hypothesis. <i>Neurology</i>, 56(12), 1746-1748.</li>
            <li>Cushing, H. (1901). Concerning a definite regulatory mechanism of the vaso-motor centre which controls blood pressure during cerebral compression. <i>The Johns Hopkins Hospital Bulletin</i>.</li>
            <li>Carney, N., Totten, A. M., O'Reilly, C., et al. (2017). Guidelines for the Management of Severe Traumatic Brain Injury, Fourth Edition. <i>Neurosurgery</i>, 80(1), 6-15.</li>
            <li>Perhimpunan Dokter Spesialis Saraf Indonesia (PERDOSSI). (2016). <i>Pedoman Tatalaksana Cedera Otak</i>.</li>
            <li>Hutchinson, P. J., Kolias, A. G., Timofeev, I. S., et al. (2016). Trial of decompressive craniectomy for traumatic intracranial hypertension (RESCUEicp). <i>New England Journal of Medicine</i>, 375(12), 1119-1130.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
