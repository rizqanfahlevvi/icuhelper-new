import React from 'react';
import { Activity, AlertTriangle, Monitor, HeartPulse, LineChart, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { PageHeader } from '../../components/ui/PageHeader';

export default function MonitoringIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorite('/monitoring');

  const Card = ({ title, icon, colorClass, children }: { title: string, icon: React.ReactNode, colorClass: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <h3 className="flex items-center gap-2 text-[13px] font-bold text-foreground">
        <div className={`p-1.5 rounded-md bg-opacity-10 dark:bg-opacity-20 ${colorClass.replace('bg-', 'text-').replace('500', '600')} ${colorClass.replace('bg-', 'bg-').replace('500', '100')} dark:${colorClass.replace('bg-', 'bg-').replace('500', '500/20')}`}>
          {icon}
        </div>
        {title}
      </h3>
      <div className="text-[13px] text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Page Title & Bookmark */}
      <div className="pt-2">
        <PageHeader 
          badgeIcon={Monitor}
          badgeText="MONITORING"
          title="Monitor Bedside ICU"
          description="Visualisasi asuhan klinis harian, troubleshooting cepat (DOPE), asuhan target ventilator, hemodinamik, dan interpretasi kapnografi."
          rightContent={
            <button
              onClick={() => toggleFavorite('/monitoring')}
              className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all active:scale-95 ${isFav ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
            >
              <Star className={`w-4 h-4 sm:mr-2 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">{isFav ? 'Difavoritkan' : 'Favoritkan'}</span>
            </button>
          }
        />
      </div>

      {/* SECTION 1: DOPE */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Troubleshooting Cepat — DOPE Mnemonic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <h3 className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <div className="p-1.5 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 font-extrabold px-2 leading-none">D</div>
              Displacement
            </h3>
            <ul className="text-[12px] sm:text-[13px] text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>ETT keluar / masuk bronkus kanan</li>
              <li>Cek: suara napas bilateral</li>
              <li>Posisi CXR: ujung T2–T3</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <h3 className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-600 font-extrabold px-2 leading-none">O</div>
              Obstruction
            </h3>
            <ul className="text-[12px] sm:text-[13px] text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Sekret, pipa tergigit, ETT kinking</li>
              <li>Tanda: PIP ↑, SpO₂ ↓</li>
              <li>Aksi: Suction in-line, cek sirkuit</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <h3 className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-500/20 text-purple-600 font-extrabold px-2 leading-none">P</div>
              Pneumothorax
            </h3>
            <ul className="text-[12px] sm:text-[13px] text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>SpO₂ drop mendadak + TD drop</li>
              <li>Suara napas asimetris, PIP ↑↑</li>
              <li>Aksi: Needle decompression segera</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <h3 className="flex items-center gap-2 text-[13px] font-bold text-foreground">
              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 font-extrabold px-2 leading-none">E</div>
              Equipment
            </h3>
            <ul className="text-[12px] sm:text-[13px] text-muted-foreground space-y-1.5 list-disc pl-4">
              <li>Sirkuit bocor, kegagalan kelistrikan</li>
              <li>Aksi: Selalu siapkan BVM di bed pasien. Lepas vent, ventilasi manual.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: Target Parameter */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 mt-8">
          <Monitor className="w-5 h-5 text-emerald-500" />
          Target Parameter Dewasa per Kondisi
        </h2>
        <div className="bg-card border border-border shadow-sm rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-3 font-semibold">Kondisi</th>
                <th className="p-3 font-semibold text-center">pH</th>
                <th className="p-3 font-semibold text-center">PaO₂ (mmHg)</th>
                <th className="p-3 font-semibold text-center">PaCO₂ (mmHg)</th>
                <th className="p-3 font-semibold text-center">SpO₂</th>
                <th className="p-3 font-semibold text-center">Pplat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
               <tr>
                <td className="p-3 font-medium">Normal / Post-op</td>
                <td className="p-3 text-center">7.35–7.45</td>
                <td className="p-3 text-center">80–100</td>
                <td className="p-3 text-center">35–45</td>
                <td className="p-3 text-center">94–98%</td>
                <td className="p-3 text-center">&lt;25</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">ARDS Mild</td>
                <td className="p-3 text-center">7.30–7.45</td>
                <td className="p-3 text-center">55–80</td>
                <td className="p-3 text-center">35–50</td>
                <td className="p-3 text-center">88–95%</td>
                <td className="p-3 text-center">&lt;30</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">ARDS Moderate-Severe</td>
                <td className="p-3 text-center">&gt;7.20</td>
                <td className="p-3 text-center">55–80</td>
                <td className="p-3 text-center">45–65 <span className="opacity-50 text-[10px] ml-1">(perm)</span></td>
                <td className="p-3 text-center">88–95%</td>
                <td className="p-3 text-center">≤28</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">PPOK Eksaserbasi</td>
                <td className="p-3 text-center">7.25–7.40</td>
                <td className="p-3 text-center">55–70</td>
                <td className="p-3 text-center">Baseline ↑</td>
                <td className="p-3 text-center">88–92%</td>
                <td className="p-3 text-center">&lt;30</td>
              </tr>
               <tr>
                <td className="p-3 font-medium">Asma Berat</td>
                <td className="p-3 text-center">&gt;7.20</td>
                <td className="p-3 text-center">60–90</td>
                <td className="p-3 text-center">45–70 <span className="opacity-50 text-[10px] ml-1">(perm)</span></td>
                <td className="p-3 text-center">94–98%</td>
                <td className="p-3 text-center">&lt;30</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Sepsis/Pneumonia</td>
                <td className="p-3 text-center">7.30–7.45</td>
                <td className="p-3 text-center">60–100</td>
                <td className="p-3 text-center">35–50</td>
                <td className="p-3 text-center">92–96%</td>
                <td className="p-3 text-center">&lt;30</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">GBS/MG</td>
                <td className="p-3 text-center">7.35–7.45</td>
                <td className="p-3 text-center">80–100</td>
                <td className="p-3 text-center">35–45</td>
                <td className="p-3 text-center">≥95%</td>
                <td className="p-3 text-center">&lt;28</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Edema Paru Kardiogenik</td>
                <td className="p-3 text-center">7.35–7.45</td>
                <td className="p-3 text-center">70–100</td>
                <td className="p-3 text-center">35–45</td>
                <td className="p-3 text-center">92–96%</td>
                <td className="p-3 text-center">&lt;25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2.5: Komplikasi */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mt-8 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Komplikasi Ventilasi Mekanik
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-red-700 dark:text-red-400">VILI (Ventilator Induced Lung Injury)</h3>
            <div className="text-[13px] text-red-900/80 dark:text-red-300/80 space-y-2">
              <p><strong>Mekanisme:</strong> Volutrauma, barotrauma, atelectrauma, biotrauma.</p>
              <p><strong>Pencegahan:</strong> VT 6 mL/kg IBW, Pplat ≤30, driving pressure ≤15, PEEP titrasi optimal.</p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-amber-700 dark:text-amber-400">VAP (Ventilator-Associated Pneumonia)</h3>
            <div className="text-[13px] text-amber-900/80 dark:text-amber-300/80 space-y-2">
              <p><strong>Definisi:</strong> Pneumonia &gt;48 jam setelah intubasi.</p>
              <p><strong>Pencegahan:</strong> Bundle VAP (HOB 30°, oral hygiene CHX, SAT/SBT daily, cuff pressure 20–30).</p>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-purple-700 dark:text-purple-400">VIDD (Diaphragm Dysfunction)</h3>
            <div className="text-[13px] text-purple-900/80 dark:text-purple-300/80 space-y-2">
              <p><strong>Mekanisme:</strong> Controlled ventilation → disuse atrophy diafragma dalam 18–69 jam.</p>
              <p><strong>Pencegahan:</strong> Preserve spontaneous breathing effort; hindari deep sedation lama; gunakan PSV mode.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Grafik & Waveforms */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mt-8 mb-4">
          <LineChart className="w-5 h-5 text-blue-500" />
          Monitoring Waveform & Loop
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Deteksi Auto-PEEP" icon={<Activity className="w-4 h-4 text-blue-500" />} colorClass="bg-blue-500">
             <ul className="list-disc pl-5 space-y-1">
               <li><strong className="text-foreground">Flow-time grafik:</strong> garis flow tidak kembali ke nol sebelum napas berikutnya.</li>
               <li><strong className="text-foreground">Expiratory hold:</strong> lakukan 0.5-1 detik untuk membaca total PEEP/Auto-PEEP murni.</li>
               <li><strong className="text-foreground">Aksi:</strong> Kurangi RR, kurangi waktu inspirasi (I:E memanjang), bronkodilator.</li>
             </ul>
          </Card>
          <Card title="P-V Loop Abnormal" icon={<LineChart className="w-4 h-4 text-purple-500" />} colorClass="bg-purple-500">
             <ul className="list-disc pl-5 space-y-1">
               <li><strong className="text-foreground">Beaked loop:</strong> "Paruh burung" di ujung kanan atas menunjukkan overdistensi / air trapping.</li>
               <li><strong className="text-foreground">Lower inflection point:</strong> Menandakan alveoli kolaps lalu terbuka kembali lambat. Titrasi PEEP di atas titik ini.</li>
             </ul>
          </Card>
        </div>
      </section>

    </div>
  );
}
