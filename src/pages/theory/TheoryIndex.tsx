import { Link } from 'react-router-dom';
import { BookOpen, BookText, Star, Moon, FileText } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { PageHeader } from '../../components/ui/PageHeader';

const THEORY_PAGES = [
  { path: 'agd', name: 'Interpretasi AGD', desc: 'Analisa gas darah dan asam-basa' },
  { path: 'airway', name: 'Manajemen Airway', desc: 'Pedoman jalan napas dan intubasi' },
  { path: 'aki-crrt', name: 'AKI & CRRT', desc: 'Acute Kidney Injury & Terapi Pengganti Ginjal' },
  { path: 'b1b6', name: 'Pendekatan B1-B6', desc: 'Sistem evaluasi komprehensif' },
  { path: 'cardiac-rhythm', name: 'Cardiac Rhythm Guide', desc: 'Aritmia life-threatening & EKG' },
  { path: 'dka-hhs', name: 'KAD & HHS', desc: 'Krisis Hiperglikemia' },
  { path: 'fisiologi', name: 'Fisiologi Ventilasi Mekanik', desc: 'Mekanika respirasi dan interaksi paru-ventilator' },
  { path: 'gagalnapas', name: 'Gagal Napas', desc: 'Klasifikasi dan Tata Laksana Tipe 1 & 2' },
  { path: 'impending', name: 'Impending Need', desc: 'Tanda-tanda bahaya dini' },
  { path: 'nutrisi', name: 'Terapi Nutrisi', desc: 'Panduan pemberian nutrisi enteral/parenteral' },
  { path: 'padis', name: 'Guideline PADIS', desc: 'Pain, Agitation, Delirium, Immobility, Sleep' },
  { path: 'sat-sbt-vap', name: 'SAT, SBT & VAP', desc: 'Bundle ventilator & penyapihan' },
  { path: 'sepsis', name: 'Sepsis & Syok Sepsis', desc: 'Surviving Sepsis Guidelines' },
  { path: 'syok', name: 'Manajemen Syok', desc: 'Tipe syok dan resusitasi' },
  { path: 'tik', name: 'Manajemen TIK', desc: 'Tatalaksana Peningkatan Tekanan Intrakranial' },
  { path: 'vent-dasar', name: 'Mode Ventilator Dasar', desc: 'VC, PC, SIMV, dan PSV' },
];

export default function TheoryIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { readingMode, setReadingMode } = useSettingsStore();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="pt-2">
        <PageHeader 
          badgeIcon={FileText}
          badgeText="REFERENSI TEORI"
          title="Teori & Pedoman"
          description="Panduan klinis ringkas dan referensi cepat medis untuk perawatan intensif."
          rightContent={
            <button
              onClick={() => setReadingMode(!readingMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                readingMode 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground'
              }`}
              title="Toggle Reading Mode"
            >
              <Moon className="w-4 h-4" />
              Reading Mode {readingMode ? 'On' : 'Off'}
            </button>
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEORY_PAGES.map((theory) => {
          const fullPath = `/theory/${theory.path}`;
          const isFav = isFavorite(fullPath);

          return (
            <Link
              key={theory.path}
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
                  <BookText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors pr-2">{theory.name}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">{theory.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
