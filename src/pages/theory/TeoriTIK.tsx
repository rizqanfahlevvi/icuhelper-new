import { FileText, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion } from '../../components/ui/Accordion';
import { AbbrLegend } from '../../components/ui/AbbrLegend';

export default function TeoriTIK() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="bg-white dark:bg-[var(--dk-surface-1)] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
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
          
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-foreground mt-3 font-mono text-[13px]">
            <strong className="text-amber-600 dark:text-amber-400 block mb-1">Target Hemodinamik Serebral:</strong>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>CPP (Cerebral Perfusion Pressure) = MAP - ICP</li>
              <li><strong className="text-foreground">Target CPP:</strong> 60 - 70 mmHg</li>
              <li><strong className="text-foreground">Normal ICP:</strong> &lt; 15 mmHg. Pada cedera otak traumatik berat, terapi dimulai bila <strong className="text-foreground">ICP &gt;22 mmHg</strong> (BTF 2016) [4].</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="⚠️ Tanda Klinis Peningkatan TIK">
          <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-foreground mb-4">
            <h4 className="font-bold text-destructive text-[13px] mb-1">Trias Cushing (Tanda Lanjut/Herniasi):</h4>
            <p className="text-[12px] text-destructive">Hipertensi (dengan <i>widened pulse pressure</i>), Bradikardia, dan Pola Napas Ireguler/depresi napas (mis. Cheyne-Stokes, ataksik). Napas Kussmaul adalah kompensasi asidosis metabolik — bukan bagian trias Cushing [3].</p>
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
            <li><strong className="text-foreground">Oksigenasi & Ventilasi:</strong> Hindari hipoksemia (PaO₂ &lt;60 mmHg / SpO₂ &lt;90%). Pertahankan normokarbia (PaCO₂ 35–45 mmHg; SIBICC 2019). <span className="text-destructive font-semibold">Hiperkapnia menyebabkan vasodilatasi serebral yang menaikkan TIK!</span></li>
            <li><strong className="text-foreground">Kontrol Tekanan Darah:</strong> target CPP 60–70 mmHg; cegah hipotensi — BTF 2016: SBP ≥100 mmHg (usia 50–69) atau ≥110 mmHg (usia 15–49 atau &gt;70). Hindari CPP &gt;70 yang dicapai dengan cairan/vasopresor agresif (risiko ARDS) [4].</li>
            <li><strong className="text-foreground">Sedasi & Analgesia:</strong> Propofol dan Fentanyl sering digunakan. Mengurangi agitasi, nyeri, dan metabolisme otak (CMRO₂).</li>
            <li><strong className="text-foreground">Normotermia:</strong> Obati demam. Demam menaikkan metabolisme otak.</li>
            <li><strong className="text-foreground">Kontrol Kejang:</strong> profilaksis (fenitoin; levetirasetam sebagai alternatif) menurunkan kejang dini pasca-trauma dalam 7 hari pertama, tetapi tidak mencegah kejang lambat [4].</li>
          </ul>

          <h4 className="font-bold text-amber-600 dark:text-amber-400 text-[13px] uppercase tracking-wider mb-2 border-b border-border pb-1 mt-6">Tier 2: Terapi Osmolar</h4>
          <p className="text-[12px] text-muted-foreground mb-2">Bila ICP tetap tinggi (&gt;22 mmHg), berikan terapi hiperosmolar untuk menarik air dari jaringan otak masuk ke intravaskuler.</p>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground mb-4">
            <li><strong className="text-foreground">Manitol 20%:</strong> Dosis 0,25–1 g/kgBB IV bolus. Diuresis osmotik — pantau status cairan; hindari pada hipotensi/hipovolemia.</li>
            <li><strong className="text-foreground">Hipertonik Salin (NaCl 3%):</strong> Pilihan bila hipotensi atau hiponatremia bersamaan. Batas atas yang lazim: Na ≤155 mEq/L dan osmolalitas ≤320 mOsm/kg (SIBICC 2019) [1].</li>
          </ul>

          <h4 className="font-bold text-destructive text-[13px] uppercase tracking-wider mb-2 border-b border-border pb-1 mt-6">Tier 3: Terapi Refrakter (Penyelamatan)</h4>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground">
            <li><strong className="text-foreground">Hiperventilasi Singkat:</strong> PaCO₂ ringan 32–35 mmHg sebagai terapi sementara (jembatan ke bedah) saat herniasi mengancam; hiperventilasi profilaksis berkepanjangan (PaCO₂ ≤25) tidak dianjurkan [1, 4].</li>
            <li><strong className="text-foreground">Barbiturate Coma:</strong> untuk ICP refrakter setelah terapi medis & bedah maksimal, hanya bila hemodinamik stabil — risiko tinggi hipotensi [4].</li>
            <li><strong className="text-foreground">Kraniektomi Dekompresi:</strong> RESCUEicp (ICP &gt;25 refrakter): mortalitas lebih rendah, tetapi lebih banyak pasien hidup dengan status vegetatif/disabilitas berat. DECRA (kraniektomi bifrontal dini untuk ICP &gt;20 yang lebih ringan): luaran fungsional lebih buruk. Diskusikan tujuan perawatan dengan keluarga [5, 6].</li>
          </ul>
        </Accordion>

        <AbbrLegend terms={['TIK', 'ICP', 'CPP', 'MAP', 'GCS', 'PaO2', 'PaCO2', 'SpO2', 'SBP', 'ARDS', 'CMRO2', 'BTF', 'SIBICC']} />

        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
          <h3 className="font-bold text-[14px] text-foreground mb-3 flex items-center gap-2">
            📚 Referensi Utama
          </h3>
          <ol className="list-decimal pl-5 text-xs text-muted-foreground space-y-1.5">
            <li>Hawryluk, G. W. J., et al. (2019). A management algorithm for patients with intracranial pressure monitoring: the Seattle International Severe Traumatic Brain Injury Consensus Conference (SIBICC). <i>Intensive Care Medicine</i>, 45(12), 1783-1794.</li>
            <li>Mokri, B. (2001). The Monro-Kellie hypothesis. <i>Neurology</i>, 56(12), 1746-1748.</li>
            <li>Cushing, H. (1901). Concerning a definite regulatory mechanism of the vaso-motor centre which controls blood pressure during cerebral compression. <i>The Johns Hopkins Hospital Bulletin</i>.</li>
            <li>Carney, N., Totten, A. M., O'Reilly, C., et al. (2017). Guidelines for the Management of Severe Traumatic Brain Injury, Fourth Edition. <i>Neurosurgery</i>, 80(1), 6-15.</li>
            <li>Cooper, D. J., et al. (2011). Decompressive craniectomy in diffuse traumatic brain injury (DECRA). <i>New England Journal of Medicine</i>, 364(16), 1493-1502.</li>
            <li>Hutchinson, P. J., Kolias, A. G., Timofeev, I. S., et al. (2016). Trial of decompressive craniectomy for traumatic intracranial hypertension (RESCUEicp). <i>New England Journal of Medicine</i>, 375(12), 1119-1130.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
