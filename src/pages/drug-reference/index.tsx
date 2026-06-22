import { useState, useMemo } from 'react';
import { Search, Pill, ChevronDown, CheckCircle2, AlertTriangle, ArrowDown, XCircle, ChevronRight, Star } from 'lucide-react';
import { ICU_DRUGS } from './data';
import { DrugItem } from './types';
import DrugModal from './DrugModal';
import VasopressorFlowchart from './VasopressorFlowchart';
import SedationLadder from './SedationLadder';
import DrugInteractionChecker from './DrugInteractionChecker';
import { useFavoritesStore } from '../../store/useFavoritesStore';

const CATEGORIES = [
  { id: 'all', label: 'Semua Obat', color: 'bg-muted-foreground' },
  { id: 'vasopressor', label: '🫀 Vasopressor', color: 'bg-red-400' },
  { id: 'inotropik', label: '💓 Inotropik', color: 'bg-blue-400' },
  { id: 'sedasi', label: '💤 Sedasi', color: 'bg-purple-400' },
  { id: 'analgesia', label: '💊 Analgesia', color: 'bg-orange-400' },
  { id: 'nmb', label: '⚡ NMB', color: 'bg-blue-600' },
  { id: 'antibiotik', label: '🦠 Antibiotik', color: 'bg-teal-400' },
  { id: 'antifungal', label: '🍄 Antifungal', color: 'bg-yellow-500' },
  { id: 'antiviral', label: '🧬 Antiviral', color: 'bg-green-400' },
  { id: 'high_alert', label: '🚨 High-Alert', color: 'bg-red-600' },
  { id: 'kardiovaskular', label: '❤️ Kardio', color: 'bg-rose-400' },
  { id: 'steroid', label: '💉 Steroid', color: 'bg-purple-500' },
  { id: 'gi', label: '🫙 GI', color: 'bg-orange-500' },
  { id: 'pregnancy_safe', label: '🤰 Aman Hamil', color: 'bg-pink-400' }
];

const EGFR_BANDS = [
  { id: 'all', label: 'Semua (tanpa filter)', shortLabel: 'eGFR Mode' },
  { id: 'ge60', label: '≥60 mL/min · Normal', shortLabel: '≥60' },
  { id: 'r30_60', label: '30–60 mL/min · CKD 3', shortLabel: '30-60' },
  { id: 'r15_30', label: '15–30 mL/min · CKD 4', shortLabel: '15-30' },
  { id: 'r_lt15', label: '<15 mL/min · CKD 5', shortLabel: '<15' },
  { id: 'hd', label: 'HD · Hemodialisis', shortLabel: 'HD' },
  { id: 'crrt', label: 'CRRT · Continuous RRT', shortLabel: 'CRRT' }
];

export default function DrugReference() {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [subTab, setSubTab] = useState<'obat' | 'interaksi'>('obat');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEgfrBand, setSelectedEgfrBand] = useState('all');
  const [sortOrder, setSortOrder] = useState('name');
  
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showEgfrMenu, setShowEgfrMenu] = useState(false);

  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);

  const isFav = isFavorite('/drug-reference');

  const toggleDrug = (key: string) => {
    if (selectedDrugs.includes(key)) {
      setSelectedDrugs(prev => prev.filter(d => d !== key));
    } else if (selectedDrugs.length < 8) {
      setSelectedDrugs(prev => [...prev, key]);
    }
  };

  const getDisplayCategory = (drug: any): string => {
    const cats = drug.category || [];
    const cls = (drug.class || "").toLowerCase();
    const subclass = (drug.subclass || "").toLowerCase();

    if (cats.includes("antibiotik")) return "Antibiotik";
    if (cats.includes("antifungal") || cls.includes("antifungal")) return "Antijamur";
    if (cats.includes("antiviral") || cls.includes("antiviral")) return "Antiviral";
    if (cats.includes("nmb") || cls.includes("nmb") || subclass.includes("pelumpuh")) return "NMB";
    if (cats.includes("sedasi") || cls.includes("sedatif")) return "Sedatif";
    if (cats.includes("analgesia") || cls.includes("analgetik") || cls.includes("opiat")) return "Analgetik";
    if (cats.includes("vasopressor") || cats.includes("inotropik") || cls.includes("katekolamin") || cls.includes("inotropik") || cls.includes("vasopressor")) return "Emergensi";
    if (cats.includes("kardiovaskular")) {
      if (cls.includes("antihipertensi") || subclass.includes("hipertensi") || subclass.includes("inhibitor") || subclass.includes("bloker") || subclass.includes("blocker")) return "Antihipertensi";
      if (cls.includes("antiaritmia")) return "Antiaritmia";
      return "Kardio";
    }
    if (cls.includes("bronkodilator") || cls.includes("metilsantin")) return "Bronkodilator";
    if (cats.includes("gi")) return "Zat GI";
    if (cats.includes("steroid")) return "Kortikosteroid";
    
    if (drug.class) {
      if (drug.class.length > 15) return drug.class.substring(0, 15) + '...';
      return drug.class;
    }
    return "Lainnya";
  };

  const getDotColor = (displayCategory: string) => {
    const cat = displayCategory.toLowerCase();
    if (cat.includes('emergensi') || cat.includes('presor') || cat.includes('inotropik')) return 'bg-red-500';
    if (cat.includes('antibiotik')) return 'bg-emerald-500';
    if (cat.includes('antijamur') || cat.includes('antiviral') || cat.includes('sedatif') || cat.includes('analgetik') || cat.includes('bronkodilator')) return 'bg-sky-400';
    return 'bg-blue-600';
  };

  const getCategoryBadgeStyle = (displayCategory: string) => {
    const cat = displayCategory.toLowerCase();
    if (cat.includes('emergensi')) {
      return 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20';
    }
    if (cat.includes('antibiotik')) {
      return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20';
    }
    if (cat.includes('hipertensi') || cat.includes('kardio')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20';
    }
    return 'bg-[#ebf3ff] text-[#2563eb] border border-[#dbeafe]/40 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20';
  };

  const getRouteBadge = (drug: any) => {
    const r = drug.dosing?.route || [];
    if (r.length > 0) return r[0].toUpperCase();
    const std = (drug.dosing?.standard || '').toUpperCase();
    if (std.includes('IV') || std.includes('INFUS')) return 'IV';
    if (std.includes('PO') || std.includes('ORAL') || std.includes('TABLET')) return 'PO';
    return 'IV';
  };

  const drugsList = useMemo(() => {
    let list = Object.entries(ICU_DRUGS).map(([id, data]) => ({ id, ...data }));

    // Apply search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(drug => {
        const text = [
          drug.name,
          ...(drug.brand_id || []),
          drug.class || '',
          drug.subclass || '',
          ...(drug.category || []),
          ...(drug.indications?.icu_primary || [])
        ].join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'pregnancy_safe') {
        list = list.filter(drug => drug.pregnancy?.fda_category === 'A' || drug.pregnancy?.fda_category === 'B');
      } else {
        list = list.filter(drug => drug.category?.includes(selectedCategory));
      }
    }

    // Apply sort
    if (sortOrder === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'category') {
      list.sort((a, b) => {
        const catA = (a.category && a.category[0]) || '';
        const catB = (b.category && b.category[0]) || '';
        return catA.localeCompare(catB);
      });
    } else if (sortOrder === 'renal_flag') {
      const getVal = (d: DrugItem) => {
        const b = d.renal_adjustment?.badge;
        if (b === 'avoid') return 0;
        if (b === 'reduce') return 1;
        if (b === 'adjust') return 2;
        return 3;
      };
      list.sort((a, b) => getVal(a) - getVal(b));
    }

    return list;
  }, [searchTerm, selectedCategory, sortOrder]);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  const activeEgfr = EGFR_BANDS.find(c => c.id === selectedEgfrBand) || EGFR_BANDS[0];

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2 mb-1.5 flex-wrap">
            💊 Drug Reference ICU
            <button
              onClick={() => toggleFavorite('/drug-reference')}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
            >
              <Star className={`w-5 h-5 ${isFav ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30 hover:text-amber-500'}`} />
            </button>
          </h1>
          <p className="text-muted-foreground text-[13px]">
            Panduan dosis, penyesuaian ginjal, interaksi, dan protokol pemberian obat-obatan di ICU.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex w-full md:w-auto bg-muted/65 p-1 rounded-2xl border border-border/80 shadow-sm">
          <button
            onClick={() => setSubTab('obat')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'obat'
                ? 'bg-background text-primary shadow-sm border border-border/10 font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Obat</span>
          </button>
          <button
            onClick={() => setSubTab('interaksi')}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'interaksi'
                ? 'bg-background text-primary shadow-sm border border-border/10 font-black'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Interaksi Obat</span>
            {selectedDrugs.length > 0 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-extrabold">
                {selectedDrugs.length}
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted-foreground/15 text-muted-foreground font-bold">
                0
              </span>
            )}
          </button>
        </div>
      </div>

      {subTab === 'obat' ? (
        <>
          <div className="flex flex-col gap-3 p-4 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 relative">
          
          <div className="relative flex-1">
            <button 
              onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowEgfrMenu(false); }}
              className="flex items-center justify-between w-full px-4 py-2 bg-background border border-border rounded-lg text-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeCategory.color}`}></span>
                <span className="font-medium text-foreground">{activeCategory.label}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground opacity-70" />
            </button>
            {showCategoryMenu && (
              <div className="absolute top-12 left-0 w-full z-50 bg-card border border-border rounded-lg shadow-xl p-1 max-h-[300px] overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setShowCategoryMenu(false); }}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors ${selectedCategory === cat.id ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cat.color}`}></span> {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <button 
              onClick={() => { setShowEgfrMenu(!showEgfrMenu); setShowCategoryMenu(false); }}
              className="flex items-center justify-between w-full px-4 py-2 bg-background border border-border rounded-lg text-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">⚡</span>
                <span className="font-medium text-foreground">{activeEgfr.shortLabel}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground opacity-70" />
            </button>
            {showEgfrMenu && (
              <div className="absolute top-12 left-0 w-full sm:w-[250px] z-50 bg-card border border-border rounded-lg shadow-xl p-1">
                {EGFR_BANDS.map(band => (
                  <button 
                    key={band.id}
                    onClick={() => { setSelectedEgfrBand(band.id); setShowEgfrMenu(false); }}
                    className={`block w-full text-left px-3 py-2 text-xs font-mono rounded-md hover:bg-muted/50 transition-colors ${selectedEgfrBand === band.id ? 'bg-primary/10 font-bold text-primary' : 'text-muted-foreground'}`}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1 sm:flex-[1.5]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari obat..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute left-[calc(100%-28px)] top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1">
          <span className="text-xs text-muted-foreground font-medium pl-1">
            {Object.keys(ICU_DRUGS).length === 0 ? 'Data obat belum tersedia.' : `Menampilkan ${drugsList.length} obat`}
            {selectedEgfrBand !== 'all' && ` | Mode eGFR Aktif`}
          </span>
          <select 
            value={sortOrder} 
            onChange={e => setSortOrder(e.target.value)}
            className="px-2 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:outline-none"
          >
            <option value="name">A–Z Nama</option>
            <option value="category">Kategori</option>
            <option value="renal_flag">eGFR: Butuh Penyesuaian</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-center p-3.5 text-center text-[#4b5563] dark:text-[#a1a1aa] bg-[#f8f9ff] dark:bg-muted/15 border border-[#e6e9f5] dark:border-border/60 rounded-2xl text-[12.5px] leading-relaxed font-semibold shadow-sm select-none">
        <span>Pilih obat dengan mencentang bulatan putih di kiri kartu obat di bawah untuk mendeteksi interaksi klinis secara otomatis.</span>
      </div>

      {Object.keys(ICU_DRUGS).length === 0 ? (
        <div className="p-10 text-center bg-card border border-border rounded-xl">
          <Pill className="w-8 h-8 mx-auto text-muted-foreground opacity-50 mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Database Obat Belum Dimuat</h3>
          <p className="text-sm text-muted-foreground">Silakan masukkan data array `ICU_DRUGS` pada file `data.ts`.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {drugsList.map(drug => {
            const isSelected = selectedDrugs.includes(drug.id);
            const isMaxAndNotSelected = selectedDrugs.length >= 8 && !isSelected;
            const displayCategory = getDisplayCategory(drug);
            const dotColor = getDotColor(displayCategory);
            const badgeStyle = getCategoryBadgeStyle(displayCategory);
            const route = getRouteBadge(drug);
            
            const routeStyle = route === 'PO' 
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/15' 
              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 dark:bg-red-500/15';

            const badgeKey = selectedEgfrBand !== 'all' ? drug.renal_adjustment?.badge : null;

            // Construct names list: Brand names + generics (like Abacavir · ABC · Ziagen)
            const namesList = [drug.name, ...(drug.brand_id || [])].slice(0, 3);
            const namesText = namesList.join(' · ');

            return (
              <div 
                key={drug.id}
                onClick={() => setSelectedDrugId(drug.id)}
                className={`flex items-center gap-3 p-3 bg-card border rounded-2xl cursor-pointer hover:-translate-y-px active:scale-[0.99] transition-all duration-200 shadow-sm w-full ${
                  isSelected 
                    ? 'border-blue-500/40 bg-blue-500/[0.01]' 
                    : badgeKey && badgeKey !== 'safe' 
                      ? 'border-amber-500/40 hover:border-amber-500/60' 
                      : 'border-border/60 hover:border-primary/45'
                }`}
              >
                {/* White circular selector choice on the left */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isMaxAndNotSelected) {
                      toggleDrug(drug.id);
                    }
                  }}
                  disabled={isMaxAndNotSelected}
                  className={`w-[22px] h-[22px] rounded-full border-[1.5px] border-muted-foreground/30 bg-background flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? 'bg-blue-500 border-blue-500 text-white scale-105 shadow-sm' 
                      : 'hover:bg-muted/70'
                  } ${isMaxAndNotSelected ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={isMaxAndNotSelected ? "Arsip resep penuh (Maks 8 obat)" : `Pilih/Hapus ${drug.name}`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white stroke-[3.5px] fill-none stroke-current" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" stroke="currentColor" />
                    </svg>
                  )}
                </button>

                {/* Colored dot indicator */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>

                {/* Main descriptive names section */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-foreground text-[14px] leading-snug truncate">
                      {drug.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 font-bold tracking-wide rounded-full shrink-0 ${badgeStyle}`}>
                      {displayCategory}
                    </span>
                    
                    {/* Add eGFR adjust warning icon on the row when filtering is active */}
                    {badgeKey && selectedEgfrBand !== 'all' && badgeKey !== 'safe' && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-bold" title="Butuh penyesuaian ginjal!">
                        ⚠️
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate leading-snug font-medium">
                    {namesText}
                  </div>
                </div>

                {/* Route of administration badge & Chevron Action Link */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${routeStyle}`}>
                    {route}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                </div>
              </div>
            );
          })}
        </div>
      )}

          <VasopressorFlowchart />
          <SedationLadder />
        </>
      ) : (
        <DrugInteractionChecker selectedDrugs={selectedDrugs} setSelectedDrugs={setSelectedDrugs} />
      )}

      {selectedDrugId && ICU_DRUGS[selectedDrugId] && (
        <DrugModal drug={ICU_DRUGS[selectedDrugId]} onClose={() => setSelectedDrugId(null)} activeEgfr={selectedEgfrBand} />
      )}

    </div>
  );
}
