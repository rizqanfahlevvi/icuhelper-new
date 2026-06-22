import React from 'react';
import { Activity, AlertTriangle, Monitor, HeartPulse, LineChart, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';

export default function MonitoringIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorite('/monitoring');

  const Card = ({ title, icon, colorClass, children }: { title: string, icon: React.ReactNode, colorClass: string, children: React.ReactNode }) => (
    <div className={`relative bg-card backdrop-blur-md rounded-2xl border border-border shadow-sm p-4 overflow-hidden group hover:shadow-md transition-all`}>
      <div className={`absolute left-0 top-0 w-1 h-full ${colorClass}`} />
      <h3 className="flex items-center gap-2 text-base font-bold text-card-foreground mb-3 border-b border-border pb-2">
        {icon}
        {title}
      </h3>
      <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Title & Bookmark */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Monitor className="w-6 h-6 text-primary" /> Monitor Bedside ICU
          <button
            onClick={() => toggleFavorite('/monitoring')}
            className="p-1.5 rounded-full hover:bg-muted transition-colors ml-1"
            title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
          >
            <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
          </button>
        </h1>
        <p className="text-muted-foreground text-[13px] mt-1">
          Visualisasi asuhan klinis harian, troubleshooting cepat (DOPE), asuhan target ventilator, hemodinamik, dan interpretasi kapnografi.
        </p>
      </div>

      {/* SECTION 1: DOPE */}
      <section>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Troubleshooting Cepat — DOPE Mnemonic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-red-500 mb-2">D — Displacement</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>ETT keluar / masuk bronkus kanan</li>
              <li>Cek: suara napas bilateral</li>
              <li>Posisi CXR: ujung T2–T3</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-amber-500 mb-2">O — Obstruction</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Sekret, pipa tergigit, ETT kinking</li>
              <li>Tanda: PIP ↑, SpO₂ ↓</li>
              <li>Aksi: Suction in-line, cek sirkuit</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-purple-500 mb-2">P — Pneumothorax</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>SpO₂ drop mendadak + TD drop</li>
              <li>Suara napas asimetris, PIP ↑↑</li>
              <li>Aksi: Needle decompression segera</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-blue-500 mb-2">E — Equipment</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
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
            </tbody>
          </table>
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
