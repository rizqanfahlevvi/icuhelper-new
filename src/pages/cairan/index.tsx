import React, { useState, useMemo } from 'react';
import { Search, Droplets, AlertTriangle, Filter, Star } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { CF_FLUIDS } from './data';
import { FluidItem } from './types';
import FluidModal from './FluidModal';

const CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'kristaloid', label: 'Kristaloid' },
  { id: 'hipertonik', label: 'Hipertonik' },
  { id: 'dextrose', label: 'Dextrose' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'amino', label: 'Amino' },
  { id: 'koloid', label: 'Koloid' },
  { id: 'elektrolit', label: 'Elektrolit' },
  { id: 'osmotik', label: 'Osmotik' }
];

export default function CairanIndex() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFluid, setSelectedFluid] = useState<FluidItem | null>(null);

  const isFav = isFavorite('/cairan');

  const filteredFluids = useMemo(() => {
    let result = CF_FLUIDS;
    if (activeCategory !== 'semua') {
      result = result.filter(f => f.cat === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.alias.toLowerCase().includes(q) ||
        f.badge.toLowerCase().includes(q) ||
        f.cat.toLowerCase().includes(q) ||
        f.osm.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const getCatColorClass = (cat: string) => {
    switch (cat) {
      case 'kristaloid': return 'bg-sky-500/10 text-sky-500';
      case 'hipertonik': return 'bg-red-500/10 text-red-500';
      case 'dextrose': return 'bg-amber-500/10 text-amber-500';
      case 'maintenance': return 'bg-blue-500/10 text-blue-500';
      case 'amino': return 'bg-purple-500/10 text-purple-500';
      case 'koloid': return 'bg-rose-500/10 text-rose-500';
      case 'elektrolit': return 'bg-teal-500/10 text-teal-500';
      case 'osmotik': return 'bg-indigo-500/10 text-indigo-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Droplets className="w-6 h-6 text-blue-500" /> Referensi Cairan IV
          <button
            onClick={() => toggleFavorite('/cairan')}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
          >
            <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
          </button>
        </h1>
        
        {/* Info Banner & Feature Prompt */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-sm text-primary font-medium flex items-center gap-2">
            <span className="shrink-0 flex items-center justify-center w-6 h-6 bg-primary/20 rounded-full">ℹ</span>
            36 cairan IV · 8 kategori · Referensi: SMART, BaSICS, SSC 2021
          </div>
          {/* Note: In a full app, this button would trigger a router push to the fluid calculator */}
          <button className="text-xs bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 font-bold">
            <Filter className="w-3.5 h-3.5" /> Kalkulator Kebutuhan
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mobile Category Dropdown */}
          <div className="sm:hidden">
            <select 
              value={activeCategory} 
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Desktop Category Pills */}
          <div className="hidden sm:flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === cat.id 
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                    : 'bg-card border-border hover:border-primary/50 text-muted-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 sm:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               type="text" 
               placeholder="Cari cairan..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
             />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredFluids.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          Tidak ada cairan mekanik ditemukan untuk pencarian <strong className="text-foreground">"{searchQuery}"</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFluids.map(fluid => (
             <div 
               key={fluid.id}
               onClick={() => setSelectedFluid(fluid)}
               className={`bg-card/40 backdrop-blur-md border border-border rounded-xl p-3 cursor-pointer hover:bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300 flex items-start gap-3 group relative overflow-hidden ${fluid.deprecated ? 'opacity-70' : ''}`}
             >
               
               <div className="w-14 h-16 shrink-0 bg-muted/50 rounded flex items-center justify-center border border-border flex-col overflow-hidden">
                  {fluid.img ? (
                    <img src={fluid.img} alt={fluid.name} className="w-full h-full object-cover" />
                  ) : (
                    <Droplets className="w-5 h-5 text-muted-foreground opacity-30" />
                  )}
               </div>

               <div className="flex-1 min-w-0">
                 <div className="flex items-center justify-between gap-1 mb-0.5">
                   <h3 className="font-bold text-sm truncate text-card-foreground group-hover:text-primary transition-colors">{fluid.name}</h3>
                   <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${getCatColorClass(fluid.cat)}`}>
                     {fluid.badge}
                   </span>
                 </div>
                 <div className="text-[10px] text-muted-foreground font-mono truncate mb-1.5">{fluid.osm}</div>
                 
                 <div className="flex flex-wrap gap-1 mb-1.5">
                    {fluid.comp.slice(0, 2).map((c, i) => (
                      <span key={i} className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                        {c.l}: <strong className="text-foreground">{c.v}</strong>
                      </span>
                    ))}
                 </div>

                 {fluid.ind.length > 0 && (
                   <div className="text-[10px] text-muted-foreground truncate">{fluid.ind[0].i} {fluid.ind[0].t}</div>
                 )}
                 {fluid.deprecated && (
                   <div className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1">
                     <AlertTriangle className="w-3 h-3" /> DEPRECATED
                   </div>
                 )}
                 {fluid.pending && (
                   <div className="text-[10px] font-bold text-amber-500 mt-1">⚠️ Konfirmasi Kemasan</div>
                 )}
               </div>
             </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <FluidModal 
        fluid={selectedFluid} 
        onClose={() => setSelectedFluid(null)} 
      />
    </div>
  );
}
