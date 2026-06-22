import { useState, useMemo } from 'react';
import { Search, BookText, Star } from 'lucide-react';
import { Accordion } from '../components/ui/Accordion';
import { referenceData } from '../data/referenceData';
import { useFavoritesStore } from '../store/useFavoritesStore';

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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-2">
            <BookText className="w-6 h-6" />
            Referensi & Studi Kunci
            <button
              onClick={() => toggleFavorite('/reference')}
              className="p-1.5 rounded-full hover:bg-muted transition-colors ml-1"
              title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
            >
              <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
            </button>
          </h1>
          <p className="text-muted-foreground text-[13px]">
            Kumpulan panduan klinis, trial utama, referensi lokal, dan sumber dosis obat yang menjadi landasan tata laksana di ICU.
          </p>
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
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <div className="min-w-[600px] p-3 pt-0">
                    <table className="w-full text-left border-collapse text-[12px]">
                      <thead>
                        <tr>
                          <th className="p-2 border-b border-border font-semibold text-muted-foreground w-[30%]">{section.headers[0]}</th>
                          <th className="p-2 border-b border-border font-semibold text-muted-foreground w-[20%]">{section.headers[1]}</th>
                          {section.headers[2] && (
                            <th className="p-2 border-b border-border font-semibold text-muted-foreground w-[50%]">{section.headers[2]}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="p-2 text-foreground font-medium align-top">
                              {item.col1}
                            </td>
                            <td className="p-2 text-muted-foreground align-top">
                              {item.col2}
                            </td>
                            {section.headers[2] && (
                              <td className="p-2 text-muted-foreground align-top">
                                {item.col3}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Accordion>
            );
          })
        )}
      </div>
    </div>
  );
}
