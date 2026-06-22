import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { DrugItem } from './types';

interface Props {
  drug: DrugItem;
  onClose: () => void;
  activeEgfr: string;
}

export default function DrugModal({ drug, onClose, activeEgfr }: Props) {
  const [activeTab, setActiveTab] = useState('umum');

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-safe pb-safe">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container Card */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-card border border-border shadow-2xl rounded-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">{drug.name}</h2>
            <div className="text-sm text-muted-foreground">
              {drug.class} {drug.subclass && `· ${drug.subclass}`}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-4 border-b border-border overflow-x-auto hide-scrollbar flex-shrink-0 bg-muted/10">
          {[
            { id: 'umum', label: '📋 Umum' },
            { id: 'dosis', label: '💉 Dosis' },
            { id: 'khusus', label: '🔄 Kondisi Khusus' },
            { id: 'keamanan', label: '⚠ Keamanan' },
            { id: 'lainnya', label: '⚡ Lainnya' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          
          {activeTab === 'umum' && (
            <div className="space-y-6">
              {drug.indications && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Indikasi ICU</h3>
                  <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-2">
                    {drug.indications.icu_primary && (
                      <div>
                        <strong className="text-xs text-foreground block mb-1">Primer:</strong>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {drug.indications.icu_primary.map((i, idx) => <li key={idx}>{i}</li>)}
                        </ul>
                      </div>
                    )}
                     {drug.indications.icu_secondary && (
                      <div className="mt-2">
                        <strong className="text-xs text-foreground block mb-1">Sekunder:</strong>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {drug.indications.icu_secondary.map((i, idx) => <li key={idx}>{i}</li>)}
                        </ul>
                      </div>
                    )}
                    {drug.indications.local_guideline && (
                      <div className="mt-3 p-2 bg-background rounded border border-border text-xs">
                        <strong className="text-foreground">Lokal: </strong>
                        <span className="text-muted-foreground">{drug.indications.local_guideline}</span>
                      </div>
                    )}
                    {drug.indications.intl_guideline && (
                      <div className="mt-2 p-2 bg-background rounded border border-border text-xs">
                        <strong className="text-foreground">Int'l: </strong>
                        <span className="text-muted-foreground">{drug.indications.intl_guideline}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {drug.mechanism && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Farmakologi</h3>
                  <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{drug.mechanism}</p>
                    {drug.pkpd_type && (
                      <p className="text-xs"><strong className="text-foreground">PK/PD: </strong><span className="text-muted-foreground">{drug.pkpd_type} {drug.pkpd_note && `— ${drug.pkpd_note}`}</span></p>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'dosis' && (
            <div className="space-y-6">
              {drug.dosing ? (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Dosis & Cara Pemberian</h3>
                  <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-3">
                    {drug.dosing.standard && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Standar: </strong><span className="text-muted-foreground">{drug.dosing.standard}</span></p>}
                    {drug.dosing.loading && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Loading: </strong><span className="text-muted-foreground">{drug.dosing.loading}</span></p>}
                    {drug.dosing.maintenance && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Maintenance: </strong><span className="text-muted-foreground">{drug.dosing.maintenance}</span></p>}
                    {(drug.dosing.range_low || drug.dosing.range_high) && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Range: </strong><span className="text-muted-foreground">{drug.dosing.range_low || '—'} → {drug.dosing.range_high || '—'}</span></p>}
                    {drug.dosing.max && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Maks: </strong><span className="text-muted-foreground">{drug.dosing.max}</span></p>}
                    {drug.dosing.route && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Route: </strong><span className="text-muted-foreground">{drug.dosing.route.join(', ')}</span></p>}
                    
                    {(drug.dosing.dilution || drug.dosing.rate || drug.dosing.titration) && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                        {drug.dosing.dilution && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Pengenceran: </strong><span className="text-muted-foreground">{drug.dosing.dilution}</span></p>}
                        {drug.dosing.rate && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Rate: </strong><span className="text-muted-foreground">{drug.dosing.rate}</span></p>}
                        {drug.dosing.titration && <p className="text-sm text-slate-800 dark:text-slate-200"><strong className="text-foreground">Titrasi: </strong><span className="text-muted-foreground">{drug.dosing.titration}</span></p>}
                      </div>
                    )}
                    
                    {drug.dosing.special_notes && (
                       <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <strong className="text-amber-600 dark:text-amber-400 dark:text-amber-500 text-xs block mb-1">⚠ Catatan Penting:</strong>
                        <span className="text-xs text-amber-700 dark:text-amber-300 dark:text-amber-400">{drug.dosing.special_notes}</span>
                      </div>
                    )}
                  </div>
                </section>
              ) : (
                <div className="text-center mt-10 opacity-50 text-xs italic">Informasi dosis tidak tersedia.</div>
              )}

              {drug.evidence && drug.evidence.length > 0 && (
                <section className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">📚 Referensi & Sitasi Ilmiah</h3>
                  <div className="bg-card border border-border shadow-sm rounded-lg p-3 space-y-2">
                     {drug.evidence.map((ref: any, idx: number) => (
                       <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                         <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 mt-0.5 font-bold text-primary">{ref.ref_id || (idx+1)}</span>
                         <span>{ref.note || ref.title || ref.description || ref}</span>
                       </div>
                     ))}
                  </div>
                </section>
              )}
            </div>
          )}
          
          {activeTab === 'khusus' && (
            <div className="space-y-6">
              {drug.renal_adjustment && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Penyesuaian Renal</h3>
                  <div className="overflow-hidden border border-border rounded-lg max-w-full">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 border-b border-border font-mono text-[10px]">eGFR</th>
                          <th className="px-3 py-2 border-b border-border">Ket.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { key: 'ge60', label: '≥60' },
                          { key: 'r30_60', label: '30-60' },
                          { key: 'r15_30', label: '15-30' },
                          { key: 'r_lt15', label: '<15' },
                          { key: 'hd', label: 'HD' },
                          { key: 'crrt', label: 'CRRT' },
                        ].map(b => {
                          const val = drug.renal_adjustment?.[b.key as keyof typeof drug.renal_adjustment] as any;
                          const isActive = activeEgfr === b.key || (activeEgfr === 'all' && b.key === 'ge60');
                          if (!val && !drug.renal_adjustment?.[b.key as keyof typeof drug.renal_adjustment]) return null;
                          return (
                            <tr key={b.key} className={`${isActive ? 'bg-primary/5' : 'bg-card'}`}>
                              <td className={`px-3 py-2 whitespace-nowrap font-mono ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{b.label}</td>
                              <td className={`px-3 py-2 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {typeof val === 'string' ? val : (val ? `${val.dose || ''} ${val.interval || ''}${val.route ? ` (${val.route})` : ''} ${val.note ? `— ${val.note}` : ''}` : '—')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {drug.renal_adjustment.monitoring_renal && (
                    <div className="mt-2 p-2 bg-muted/20 border border-border/50 rounded-lg text-xs">
                      <strong className="text-foreground">Monitor: </strong><span className="text-muted-foreground">{drug.renal_adjustment.monitoring_renal}</span>
                    </div>
                  )}
                </section>
              )}

              {drug.hepatic_adjustment && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Penyesuaian Hepatik</h3>
                  <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-2 text-sm text-muted-foreground">
                    {typeof drug.hepatic_adjustment === 'string' ? (
                      <p>{drug.hepatic_adjustment}</p>
                    ) : (
                      <>
                        {drug.hepatic_adjustment.child_a && <p><strong className="text-foreground">Child-Pugh A: </strong>{drug.hepatic_adjustment.child_a}</p>}
                        {drug.hepatic_adjustment.child_b && <p><strong className="text-foreground">Child-Pugh B: </strong>{drug.hepatic_adjustment.child_b}</p>}
                        {drug.hepatic_adjustment.child_c && <p><strong className="text-foreground">Child-Pugh C: </strong>{drug.hepatic_adjustment.child_c}</p>}
                        {drug.hepatic_adjustment.note && <div className="mt-2 text-xs italic">{drug.hepatic_adjustment.note}</div>}
                      </>
                    )}
                  </div>
                </section>
              )}

              {drug.pregnancy && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Kehamilan & Menyusui</h3>
                  <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="font-bold text-foreground">Kategori FDA:</span>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${['A', 'B'].includes(drug.pregnancy.fda_category) ? 'bg-green-500/10 text-green-600 dark:text-green-400' : ['D', 'X'].includes(drug.pregnancy.fda_category) ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                         {drug.pregnancy.fda_category || 'Tidak diketahui'}
                       </span>
                    </div>
                    {drug.pregnancy.trimester_1 && <p><strong className="text-foreground text-xs">Trimester 1: </strong>{drug.pregnancy.trimester_1}</p>}
                    {drug.pregnancy.trimester_2 && <p><strong className="text-foreground text-xs">Trimester 2: </strong>{drug.pregnancy.trimester_2}</p>}
                    {drug.pregnancy.trimester_3 && <p><strong className="text-foreground text-xs">Trimester 3: </strong>{drug.pregnancy.trimester_3}</p>}
                    {drug.pregnancy.lactation && <p className="mt-2 border-t border-border/50 pt-2"><strong className="text-foreground text-xs">Menyusui: </strong>{drug.pregnancy.lactation} {drug.pregnancy.lactation_note && `(${drug.pregnancy.lactation_note})`}</p>}
                  </div>
                </section>
              )}
              
              {!drug.renal_adjustment && !drug.hepatic_adjustment && !drug.pregnancy && (
                <div className="text-center mt-10 opacity-50 text-xs italic">Informasi kondisi khusus tidak tersedia.</div>
              )}

              {drug.evidence && drug.evidence.length > 0 && (
                <section className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">📚 Referensi & Sitasi Ilmiah</h3>
                  <div className="bg-card border border-border shadow-sm rounded-lg p-3 space-y-2">
                     {drug.evidence.map((ref: any, idx: number) => (
                       <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                         <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 mt-0.5 font-bold text-primary">{ref.ref_id || (idx+1)}</span>
                         <span>{ref.note || ref.title || ref.description || ref}</span>
                       </div>
                     ))}
                  </div>
                </section>
              )}
            </div>
          )}
          
          {activeTab === 'keamanan' && (
            <div className="space-y-6">
              {drug.monitoring && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Monitoring</h3>
                  <div className="bg-muted/20 border border-border/50 rounded-lg p-3 space-y-3">
                    {drug.monitoring.efficacy && drug.monitoring.efficacy.length > 0 && (
                      <div>
                        <strong className="text-xs text-foreground block mb-1">Efikasi:</strong>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {drug.monitoring.efficacy.map((e, idx) => <li key={idx}>{e}</li>)}
                        </ul>
                      </div>
                    )}
                    {drug.monitoring.safety && drug.monitoring.safety.length > 0 && (
                      <div>
                        <strong className="text-xs text-foreground block mb-1">Keamanan:</strong>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {drug.monitoring.safety.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {drug.adverse_effects && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Efek Samping</h3>
                  <div className="space-y-3">
                    {drug.adverse_effects.critical && drug.adverse_effects.critical.length > 0 && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <strong className="text-red-500 text-xs block mb-1">Kritis / Fatal:</strong>
                        <ul className="list-disc pl-5 text-sm text-red-500/80">
                          {drug.adverse_effects.critical.map((c, idx) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                    )}
                    {drug.adverse_effects.common && drug.adverse_effects.common.length > 0 && (
                      <div className="p-3 bg-muted/20 border border-border/50 rounded-lg">
                        <strong className="text-xs text-foreground block mb-1">Umum:</strong>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                          {drug.adverse_effects.common.map((c, idx) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {activeTab === 'lainnya' && (
            <div className="space-y-6">
              {drug.interactions && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Interaksi Obat</h3>
                  <div className="space-y-3">
                    {drug.interactions.major && drug.interactions.major.length > 0 && (
                      <div>
                        <strong className="text-xs text-red-500 block mb-2">Interaksi Mayor:</strong>
                        <div className="space-y-2">
                          {drug.interactions.major.map((m: any, idx: number) => {
                            const ix = typeof m === 'string' ? { drug: m } : m;
                            return (
                              <div key={idx} className="p-3 bg-red-500/5 border-l-2 border-l-red-500 rounded-r-lg text-sm text-muted-foreground">
                                <strong className="text-foreground block mb-1">{ix.drug}</strong>
                                {ix.effect && <div>{ix.effect}</div>}
                                {(ix.management || ix.mgmt) && <div className="mt-1 text-xs italic opacity-80">Manajemen: {ix.management || ix.mgmt}</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {drug.interactions.moderate && drug.interactions.moderate.length > 0 && (
                      <div className="mt-4">
                        <strong className="text-xs text-amber-500 block mb-2">Interaksi Moderat:</strong>
                        <div className="space-y-2">
                          {drug.interactions.moderate.map((m: any, idx: number) => {
                            const ix = typeof m === 'string' ? { drug: m } : m;
                            return (
                              <div key={idx} className="p-2 border border-amber-500/20 rounded text-xs text-muted-foreground">
                                <strong className="text-foreground mr-1">{ix.drug}:</strong>
                                <span>{ix.effect}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
              
              {drug.stewardship && typeof drug.stewardship === 'object' && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Antimicrobial Stewardship</h3>
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-sm text-muted-foreground space-y-2">
                    {drug.stewardship.duration_standard && (
                      <p><strong className="text-amber-500">Durasi Standar: </strong>{drug.stewardship.duration_standard} hari {drug.stewardship.duration_note && `(${drug.stewardship.duration_note})`}</p>
                    )}
                    {drug.stewardship.stop_criteria && (
                      <p><strong className="text-amber-500">Kriteria Stop: </strong>{drug.stewardship.stop_criteria}</p>
                    )}
                    {drug.stewardship.deescalation_to && drug.stewardship.deescalation_to.length > 0 && (
                      <p><strong className="text-amber-500">De-eskalasi ke: </strong>{drug.stewardship.deescalation_to.join(', ')}</p>
                    )}
                  </div>
                </section>
              )}

              {drug.evidence && drug.evidence.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-primary border-l-2 border-primary pl-2 mb-3">Referensi Literatur</h3>
                  <div className="bg-card border border-border shadow-sm rounded-lg p-3 space-y-2">
                     {drug.evidence.map((ref: any, idx: number) => (
                       <div key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                         <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono shrink-0 mt-0.5">{ref.ref_id || (idx+1)}</span>
                         <span>{ref.note || ref.title || ref.description || ref}</span>
                       </div>
                     ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
