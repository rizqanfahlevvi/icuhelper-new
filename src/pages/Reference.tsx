import { useState, useMemo } from 'react';
import { Search, BookText, Star, BookOpen } from 'lucide-react';
import { Accordion } from '../components/ui/Accordion';
import { referenceData } from '../data/referenceData';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { PageHeader } from '../components/ui/PageHeader';

export default function Reference() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState('');

  const isFav = isFavorite('/reference');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return referenceData;
    
    const lowerTerm = searchTerm.toLowerCase();
    
    return referenceData.map(section => {
      const matchInTitle = section.title.toLowerCase().includes(lowerTerm);
      
      const filteredItems = section.items.filter(item => {
        return item.col1.toLowerCase().includes(lowerTerm) || 
               item.col2.toLowerCase().includes(lowerTerm) || 
               item.col3.toLowerCase().includes(lowerTerm);
      });

      return {
        ...section,
        items: matchInTitle ? section.items : filteredItems,
      };
    }).filter(section => section.items.length > 0);
  }, [searchTerm]);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-4">
        <div className="pt-2">
          <PageHeader 
            badgeIcon={BookOpen}
            badgeText="LITERATUR"
            title="Referensi & Studi Kunci"
            description="Kumpulan panduan klinis, trial utama, referensi lokal, dan sumber dosis obat yang menjadi landasan tata laksana di ICU."
            rightContent={
              <button
                onClick={() => toggleFavorite('/reference')}
                className={`flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl border font-bold text-sm shadow-sm transition-all active:scale-95 ${isFav ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
              >
                <Star className={`w-4 h-4 sm:mr-2 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">{isFav ? 'Difavoritkan' : 'Favoritkan'}</span>
              </button>
            }
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Cari panduan, penulis, topik, atau jurnal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-[13px] border border-border/50 rounded-lg bg-muted/20">
            Tidak ada referensi yang cocok dengan pencarian "{searchTerm}"
          </div>
        ) : (
          filteredData.map((section, idx) => {
            // Automatically open if searching, or if it's the first section and no search
            const isFirst = idx === 0;
            const hasSearchTerm = searchTerm.trim().length > 0;
            const defaultOpen = hasSearchTerm || isFirst;

            return (
              <Accordion 
                key={section.id} 
                title={section.title} 
                defaultOpen={defaultOpen}
              >
                <div className="flex flex-col gap-3 py-2 px-1">
                  {section.items.map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl p-3.5 shadow-sm flex flex-col gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{section.headers[0]}</span>
                          <div className="text-[13px] font-semibold text-foreground mt-0.5 leading-snug">{item.col1}</div>
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{section.headers[1]}</span>
                          <div className="text-[13px] text-foreground mt-0.5 leading-snug">{item.col2}</div>
                        </div>
                      </div>
                      {section.headers[2] && item.col3 && (
                        <div className="mt-1.5 pt-2.5 border-t border-border/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{section.headers[2]}</span>
                          <div className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">{item.col3}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Accordion>
            );
          })
        )}
      </div>
    </div>
  );
}
