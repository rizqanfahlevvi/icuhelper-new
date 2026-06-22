import { Link } from 'react-router-dom';
import { Calculator, Dna, Droplets, HeartPulse, Option, Syringe, Activity, FileDigit, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';

const CALCULATORS = [
  { path: 'cairan', name: 'Kalkulator Cairan', icon: Droplets, desc: 'Kebutuhan cairan & resusitasi' },
  { path: 'drug', name: 'Drip Obat / Vasopresor', icon: Syringe, desc: 'Dosis & kecepatan infus' },
  { path: 'electro', name: 'Koreksi Elektrolit', icon: Activity, desc: 'Natrium, Kalium, dll' },
  { path: 'ibw', name: 'IBW & Tidal Volume', icon: Dna, desc: 'Berat badan ideal & TV' },
  { path: 'insulin', name: 'Kalkulator Insulin', icon: Syringe, desc: 'Drip insulin intravena' },
  { path: 'nlr', name: 'NLR', icon: FileDigit, desc: 'Neutrophil-to-Lymphocyte Ratio' },
  { path: 'nutrisi', name: 'Kalkulator Nutrisi', icon: HeartPulse, desc: 'Kebutuhan kalori & protein' },
  { path: 'pf', name: 'P/F Ratio', icon: Activity, desc: 'PaO2/FiO2 Ratio' },
  { path: 'pulmo', name: 'Pulmonologi', icon: Option, desc: 'Perhitungan pulmonologi lain' },
  { path: 'pump', name: 'Syringe Pump', icon: Syringe, desc: 'Perhitungan syringe pump umum' },
  { path: 'renal', name: 'Renal / CrCl', icon: Activity, desc: 'Creatinine Clearance & GFR' },
  { path: 'transfusi', name: 'Kebutuhan Transfusi', icon: Droplets, desc: 'Koreksi Hb & PRC/WB' },
  { path: 'ventilator-adv', name: 'Ventilator Advanced', icon: Activity, desc: 'Mekanik & setting ventilator' },
];

export default function CalculatorIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Kalkulator Klinis
        </h1>
        <p className="text-muted-foreground mt-1">Pilih alat perhitungan klinis untuk pengelolaan pasien intensif.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CALCULATORS.map((calc) => {
          const fullPath = `/calculator/${calc.path}`;
          const isFav = isFavorite(fullPath);

          return (
            <Link
              key={calc.path}
              to={fullPath}
              className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 hover:border-blue-500/50 hover:shadow-md transition-all group cursor-pointer relative shadow-sm"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(fullPath);
                  }}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
                >
                  <Star className={`w-4 h-4 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
                </button>
              </div>

              <div className="flex items-start gap-4 pr-6">
                <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <calc.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors pr-2">{calc.name}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">{calc.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
