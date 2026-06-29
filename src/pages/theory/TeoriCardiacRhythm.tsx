import React from 'react';
import { Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion } from '../../components/ui/Accordion';

export default function TeoriCardiacRhythm() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/theory" className="p-2 -ml-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Cardiac Rhythm Guide
        </h1>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 shadow-sm">
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Panduan visual cepat (quick-look) untuk mengenali aritmia yang mengancam nyawa. Selalu konfirmasi dengan kondisi klinis pasien (nadi teraba, perfusi jaringan).
        </p>

        <div className="space-y-6">
          {/* VF */}
          <div className="border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-200 dark:border-red-900/50">
              <h3 className="font-bold text-red-700 dark:text-red-400 text-lg flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                Ventricular Fibrillation (VF)
              </h3>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-[#1C1C1E]">
              <div className="h-16 w-full relative bg-red-50/50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30 overflow-hidden flex items-center">
                <svg viewBox="0 0 400 100" className="w-full h-full stroke-red-500 dark:stroke-red-400 fill-none" strokeWidth="2.5" strokeLinejoin="round" preserveAspectRatio="none">
                  <path d="M0,50 Q10,20 20,60 T40,40 T60,70 T80,30 T100,80 T120,40 T140,90 T160,20 T180,60 T200,30 T220,80 T240,40 T260,70 T280,20 T300,90 T320,30 T340,80 T360,40 T380,70 T400,50" />
                </svg>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li><strong>Rate/Irama:</strong> Cepat, ireguler, kacau (chaotic).</li>
                <li><strong>Kompleks QRS:</strong> Tidak dapat dikenali; gelombang fibrilasi tidak beraturan.</li>
                <li><strong>P Wave & PR Interval:</strong> Tidak ada.</li>
                <li><strong>Tindakan:</strong> Defibrilasi segera (Shockable rhythm) & CPR.</li>
              </ul>
            </div>
          </div>

          {/* Pulseless VT */}
          <div className="border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-200 dark:border-red-900/50">
              <h3 className="font-bold text-red-700 dark:text-red-400 text-lg flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                Ventricular Tachycardia (VT) - Monomorphic
              </h3>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-[#1C1C1E]">
               <div className="h-16 w-full relative bg-red-50/50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30 overflow-hidden flex items-center">
                <svg viewBox="0 0 400 100" className="w-full h-full stroke-red-500 dark:stroke-red-400 fill-none" strokeWidth="2.5" strokeLinejoin="round" preserveAspectRatio="none">
                  <path d="M0,50 L20,10 L40,90 L60,10 L80,90 L100,10 L120,90 L140,10 L160,90 L180,10 L200,90 L220,10 L240,90 L260,10 L280,90 L300,10 L320,90 L340,10 L360,90 L380,10 L400,50" />
                </svg>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li><strong>Rate/Irama:</strong> 100–250 bpm, reguler.</li>
                <li><strong>Kompleks QRS:</strong> Lebar (≥ 0.12 detik), seragam bentuknya.</li>
                <li><strong>P Wave:</strong> Tidak terlihat (tenggelam di kompleks QRS).</li>
                <li><strong>Tindakan (Tanpa Nadi):</strong> Defibrilasi (Shockable rhythm) & CPR.</li>
                <li><strong>Tindakan (Nadi Teraba):</strong> Kardioversi tersinkronisasi (jika tidak stabil) atau anti-aritmia (Amiodaron) jika stabil.</li>
              </ul>
            </div>
          </div>

          {/* Torsades de Pointes */}
          <div className="border border-orange-200 dark:border-orange-900/50 rounded-xl overflow-hidden">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 border-b border-orange-200 dark:border-orange-900/50">
              <h3 className="font-bold text-orange-700 dark:text-orange-400 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Torsades de Pointes (Polymorphic VT)
              </h3>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-[#1C1C1E]">
               <div className="h-16 w-full relative bg-orange-50/50 dark:bg-orange-900/10 rounded border border-orange-100 dark:border-orange-900/30 overflow-hidden flex items-center">
                <svg viewBox="0 0 400 100" className="w-full h-full stroke-orange-500 dark:stroke-orange-400 fill-none" strokeWidth="2" strokeLinejoin="round" preserveAspectRatio="none">
                  <path d="M0,50 Q10,40 20,60 Q30,30 40,70 Q50,20 60,80 L70,10 L80,90 L90,20 L100,80 Q110,30 120,70 Q130,40 140,60 Q150,50 160,50 Q170,40 180,60 Q190,30 200,70 Q210,20 220,80 L230,10 L240,90 L250,20 L260,80 Q270,30 280,70 Q290,40 300,60 Q310,50 320,50 Q330,40 340,60 Q350,30 360,70 Q370,20 380,80 L390,10 L400,90" />
                </svg>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li><strong>Rate/Irama:</strong> 200–250 bpm, reguler/ireguler, memutar (twisting) di sekitar garis isoelektrik.</li>
                <li><strong>Kompleks QRS:</strong> Lebar, bervariasi ukuran dan amplitudonya (seperti kumparan).</li>
                <li><strong>Penyebab:</strong> Sering dipicu oleh prolonged QT interval (hipokalemia, hipomagnesemia, obat-obatan).</li>
                <li><strong>Tindakan:</strong> IV Magnesium Sulfat, defibrilasi jika pulseless.</li>
              </ul>
            </div>
          </div>

          {/* Asystole / PEA */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                Asystole & PEA
              </h3>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-[#1C1C1E]">
               <div className="h-16 w-full relative bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center">
                <svg viewBox="0 0 400 100" className="w-full h-full stroke-slate-500 dark:stroke-slate-400 fill-none" strokeWidth="2.5" strokeLinejoin="round" preserveAspectRatio="none">
                  <path d="M0,50 L400,50" />
                </svg>
              </div>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li><strong>Asystole:</strong> "Flatline", tidak ada aktivitas elektrik jantung.</li>
                <li><strong>Pulseless Electrical Activity (PEA):</strong> Ada aktivitas listrik (irama apapun selain VF/VT tanpa nadi) tetapi TIDAK menghasilkan curah jantung/nadi yang teraba.</li>
                <li><strong>Tindakan:</strong> CPR & Epinefrin 1 mg setiap 3-5 menit. BUKAN shockable rhythm. Identifikasi dan atasi penyebab reversible (H's & T's).</li>
              </ul>
            </div>
          </div>

          {/* Atrial Fibrillation */}
          <div className="border border-blue-200 dark:border-blue-900/50 rounded-xl overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-200 dark:border-blue-900/50">
              <h3 className="font-bold text-blue-700 dark:text-blue-400 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Atrial Fibrillation (AFib)
              </h3>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-[#1C1C1E]">
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li><strong>Rate/Irama:</strong> Ireguler secara ireguler (irregularly irregular). Atrial rate &gt; 300 bpm, Ventricular rate bervariasi.</li>
                <li><strong>P Wave:</strong> Tidak ada gelombang P yang jelas; digantikan oleh gelombang fibrilasi (gelombang f) halus atau kasar.</li>
                <li><strong>Kompleks QRS:</strong> Biasanya sempit (normal).</li>
                <li><strong>Bahaya:</strong> AF dengan respons ventrikel cepat (RVR) dapat menyebabkan dekompensasi atau syok. Risiko tinggi tromboemboli (stroke).</li>
              </ul>
            </div>
          </div>
          
          {/* SVT */}
          <div className="border border-blue-200 dark:border-blue-900/50 rounded-xl overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-200 dark:border-blue-900/50">
              <h3 className="font-bold text-blue-700 dark:text-blue-400 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Supraventricular Tachycardia (SVT)
              </h3>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-[#1C1C1E]">
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-4">
                <li><strong>Rate/Irama:</strong> Biasanya sangat reguler, kecepatan jantung 150-250 bpm.</li>
                <li><strong>P Wave:</strong> Sering tenggelam dalam kompleks QRS atau gelombang T sebelumnya karena takikardia ekstrem. Jika terlihat, morfologinya berbeda dengan sinus P.</li>
                <li><strong>Kompleks QRS:</strong> Biasanya sempit (normal, &lt; 0.12 detik).</li>
                <li><strong>Tindakan:</strong> Jika pasien stabil: Vagal maneuver, Adenosin IV. Jika pasien tidak stabil: Kardioversi tersinkronisasi.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      
      <Accordion title="🔍 H's and T's (Penyebab Reversible PEA/Asistol)">
        <div className="text-sm text-muted-foreground space-y-4">
          <p>Selalu pertimbangkan penyebab berikut saat resusitasi henti jantung (terutama PEA/Asystole):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-foreground mb-2 text-[13px]">The H's:</h4>
              <ul className="list-disc pl-4 space-y-1 text-[13px]">
                <li>Hypovolemia</li>
                <li>Hypoxia</li>
                <li>Hydrogen ion (Acidosis)</li>
                <li>Hypo- / Hyperkalemia</li>
                <li>Hypothermia</li>
                <li>Hypoglycemia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2 text-[13px]">The T's:</h4>
              <ul className="list-disc pl-4 space-y-1 text-[13px]">
                <li>Toxins</li>
                <li>Tamponade (Cardiac)</li>
                <li>Tension pneumothorax</li>
                <li>Thrombosis (Coronary - AMI)</li>
                <li>Thrombosis (Pulmonary - PE)</li>
                <li>Trauma</li>
              </ul>
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
}
