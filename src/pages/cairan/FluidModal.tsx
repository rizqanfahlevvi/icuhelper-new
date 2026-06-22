import React from 'react';
import { createPortal } from 'react-dom';
import { FluidItem } from './types';
import { X, Droplets, AlertTriangle, AlertCircle, Info, Beaker } from 'lucide-react';

interface FluidModalProps {
  fluid: FluidItem | null;
  onClose: () => void;
}

export default function FluidModal({ fluid, onClose }: FluidModalProps) {
  if (!fluid) return null;

  const pkgData = fluid.packageData;

  const getBadgeClass = (cat: string) => {
    switch (cat) {
      case 'kristaloid': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'hipertonik': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'dextrose': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'maintenance': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'amino': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'koloid': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'elektrolit': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'osmotik': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-safe pb-safe">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start gap-4 p-4 border-b border-border sticky top-0 bg-card z-10 rounded-t-2xl">
          <div className="w-16 h-20 shrink-0 bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center flex-col shrink-0 border border-border">
            {fluid.img ? (
              <img src={fluid.img} alt={fluid.name} className="w-full h-full object-cover" />
            ) : (
              <>
                <Droplets className="w-6 h-6 text-muted-foreground opacity-30" />
                <div className="text-[8px] font-mono mt-1 opacity-50 text-muted-foreground truncate w-full px-1 text-center">{fluid.name.slice(0, 8)}...</div>
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
               <h2 className="text-lg font-bold truncate">{fluid.name}</h2>
               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeClass(fluid.cat)} shrink-0`}>
                  {fluid.badge}
               </span>
             </div>
             <p className="text-xs text-muted-foreground font-mono">{fluid.alias}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto">
           {fluid.deprecated && (
             <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex gap-3">
               <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
               <p className="text-sm text-red-600 dark:text-red-400"><strong>DEPRECATED</strong> — Tidak direkomendasikan berdasarkan panduan terbaru. Gunakan alternatif yang lebih aman.</p>
             </div>
           )}

           {fluid.pending && (
             <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4 flex gap-3">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
               <p className="text-sm text-amber-600 dark:text-amber-400"><strong>Data Estimasi</strong> — Komposisi berdasarkan estimasi atau konversi. Konfirmasi kemasan sebelum penggunaan kritis.</p>
             </div>
           )}

           {/* Composition */}
           <section className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Komposisi (per Liter)</h3>
              <div className="flex flex-wrap gap-2">
                {fluid.comp.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs bg-muted/50 border border-border rounded text-muted-foreground">
                     {c.l}: <span className="font-bold text-foreground">{c.v}</span>
                  </span>
                ))}
              </div>
           </section>

           {/* Package Comp */}
           {pkgData && (pkgData.pkg.length > 0 || pkgData.pkgComp.length > 0) && (
             <section className="mb-6 pt-4 border-t border-border/50">
               {pkgData.pkg.length > 0 && (
                 <div className="mb-3">
                   <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Kemasan Tersedia</h3>
                   <div className="flex flex-wrap gap-1.5">
                     {pkgData.pkg.map(p => <span key={p} className="px-2 py-0.5 text-[10px] rounded-full border border-border bg-card">{p}</span>)}
                   </div>
                 </div>
               )}
               {pkgData.pkgComp.length > 0 && (
                 <div>
                   <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Per {pkgData.pkgRef}</h3>
                   <div className="flex flex-wrap gap-2">
                      {pkgData.pkgComp.map((c, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs bg-muted border border-border rounded text-muted-foreground">
                           {c.l}: <span className="font-bold text-primary">{c.v}</span>
                        </span>
                      ))}
                    </div>
                 </div>
               )}
             </section>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-border/50">
             {/* Indikasi */}
             <section>
               <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Indikasi</h3>
               <ul className="space-y-2">
                 {fluid.ind.map((item, i) => (
                   <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                     <span className="shrink-0 mt-0.5">{item.i}</span>
                     <span>{item.t}</span>
                   </li>
                 ))}
               </ul>
             </section>

             {/* Warn */}
             <section>
               <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Perhatian & Konsiderasi</h3>
               <ul className="space-y-2">
                 {fluid.warn.map((item, i) => (
                   <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                     <span className="shrink-0 mt-0.5">{item.i}</span>
                     <span className={item.i === '🔴' ? 'text-red-500 font-medium' : ''}>{item.t}</span>
                   </li>
                 ))}
               </ul>
             </section>
           </div>

           {/* Population */}
           {fluid.pop && fluid.pop.length > 0 && (
             <section className="mt-6 pt-6 border-t border-border/50">
               <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3 flex items-center gap-2">
                 <Info className="w-4 h-4" /> Pertimbangan Populasi
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 {fluid.pop.map((p, i) => (
                   <div key={i} className="bg-muted/30 border border-border rounded-lg p-3">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{p.g}</div>
                     <div className="text-xs text-foreground leading-relaxed">{p.n}</div>
                   </div>
                 ))}
               </div>
             </section>
           )}

           {/* Tips */}
           {fluid.tips && fluid.tips.length > 0 && (
             <section className="mt-6 pt-6 border-t border-border/50">
               <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Tips Klinis</h3>
               <ul className="space-y-2">
                 {fluid.tips.map((tip, i) => (
                   <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                     <span className="shrink-0 mt-0.5 opacity-60">💡</span>
                     <span>{tip}</span>
                   </li>
                 ))}
               </ul>
             </section>
           )}

           {/* References */}
           {fluid.ref && fluid.ref.length > 0 && (
             <section className="mt-6 pt-6 border-t border-border/50 bg-muted/10 -mx-4 px-4 pb-4">
               <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 mt-4">Referensi Literatur</h3>
               <ul className="space-y-2">
                 {fluid.ref.map((r, i) => (
                   <li key={i} className="flex gap-2 text-xs text-muted-foreground items-start font-mono">
                     <span className="shrink-0 text-primary opacity-60">→</span>
                     <span className="leading-relaxed">
                       <strong className="text-foreground">{r.t}</strong> {r.j} <span className="opacity-70">{r.d}</span>
                     </span>
                   </li>
                 ))}
               </ul>
             </section>
           )}
        </div>
      </div>
    </div>
  , document.body
  );
}
