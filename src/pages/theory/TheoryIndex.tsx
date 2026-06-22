import { Link } from 'react-router-dom';
import { BookOpen, BookText, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';

const THEORY_PAGES = [
  { path: 'airway', name: 'Manajemen Airway', desc: 'Pedoman jalan napas dan intubasi' },
  { path: 'aki-crrt', name: 'AKI & CRRT', desc: 'Acute Kidney Injury & Terapi Pengganti Ginjal' },
  { path: 'b1b6', name: 'Pendekatan B1-B6', desc: 'Sistem evaluasi komprehensif' },
  { path: 'dka-hhs', name: 'KAD & HHS', desc: 'Krisis Hiperglikemia' },
  { path: 'gagalnapas', name: 'Gagal Napas', desc: 'Klasifikasi dan Tata Laksana Tipe 1 & 2' },
  { path: 'impending', name: 'Impending Need', desc: 'Tanda-tanda bahaya dini' },
  { path: 'nutrisi', name: 'Terapi Nutrisi', desc: 'Panduan pemberian nutrisi enteral/parenteral' },
  { path: 'sat-sbt-vap', name: 'SAT, SBT & VAP', desc: 'Bundle ventilator & penyapihan' },
  { path: 'sepsis', name: 'Sepsis & Syok Sepsis', desc: 'Surviving Sepsis Guidelines' },
  { path: 'syok', name: 'Manajemen Syok', desc: 'Tipe syok dan resusitasi' },
];

export default function TheoryIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Teori & Pedoman
        </h1>
        <p className="text-muted-foreground mt-1">Panduan klinis ringkas dan referensi cepat medis.</p>
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
