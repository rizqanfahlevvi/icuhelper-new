import { Link } from 'react-router-dom';
import { FileText, ClipboardList, Activity, Star, BarChart } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { PageHeader } from '../../components/ui/PageHeader';

const SCORING_TOOLS = [
  { path: 'apache', name: 'APACHE-II', desc: 'Acute Physiology and Chronic Health Evaluation II' },
  { path: 'bfs', name: 'BFS/CFS', desc: 'Bedside Frailty Scale / Clinical Frailty Scale' },
  { path: 'camicu', name: 'CAM-ICU', desc: 'Confusion Assessment Method for ICU' },
  { path: 'candida', name: 'Candida Score', desc: 'Penilaian risiko infeksi Candida invasif' },
  { path: 'cpis', name: 'CPIS', desc: 'Clinical Pulmonary Infection Score' },
  { path: 'rass', name: 'RASS', desc: 'Richmond Agitation-Sedation Scale' },
  { path: 'sofa', name: 'SOFA', desc: 'Sequential Organ Failure Assessment' },
  { path: 'wells', name: 'Wells Score', desc: 'Penilaian klinis risiko Emboli Paru (PE/DVT)' },
];

export default function ScoringIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 overflow-x-hidden">
      <div className="pt-2">
        <PageHeader 
          badgeIcon={BarChart}
          badgeText="SISTEM SKORING"
          title="Sistem Skoring Klinis"
          description="Alat penilaian objektif untuk kondisi dan prognosis pasien di perawatan intensif."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCORING_TOOLS.map((score) => {
          const fullPath = `/scoring/${score.path}`;
          const isFav = isFavorite(fullPath);

          return (
            <Link
              key={score.path}
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
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-[#3C3C3E] transition-colors"
                  title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
                >
                  <Star className={`w-4 h-4 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
                </button>
              </div>

              <div className="flex items-start gap-4 pr-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors pr-2">{score.name}</h3>
                  <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2">{score.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
