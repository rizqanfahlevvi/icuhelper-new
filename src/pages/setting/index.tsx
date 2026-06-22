import React from 'react';
import { Wind, Activity, Heart, Brain, Scissors, Stethoscope, AlertTriangle, Info } from 'lucide-react';

export default function SettingIndex() {
  const Card = ({ title, icon, colorClass, children }: { title: string, icon: React.ReactNode, colorClass: string, children: React.ReactNode }) => (
    <div className="ios-card group">
      <div className="p-4 sm:p-5 border-b border-[var(--glass-border)] bg-[#f8f9fa] dark:bg-transparent relative overflow-hidden">
        <h3 className="text-[15px] font-bold text-[var(--label-primary)] flex items-center gap-2 relative z-10">
          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
            {icon}
          </div>
          {title}
        </h3>
      </div>
      <div className="p-4 sm:p-5 text-[13px] text-[var(--label-secondary)] space-y-4 font-medium leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-8">
      
      {/* Header Alert */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 shadow-sm">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-[13px] text-[var(--label-primary)] leading-relaxed font-medium">
          <strong className="text-primary mr-1">Catatan:</strong> 
          Semua VT berbasis IBW (Ideal Body Weight). Gunakan kalkulator IBW di tab Kalkulator. Parameter ini adalah panduan awal — sesuaikan dengan respons klinis dan ABG.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1 mb-2">
          <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-[17px] font-bold text-[var(--label-primary)]">
            Terapi Oksigen Non-Invasif
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="High-Flow Nasal Cannula (HFNC)" icon={<Wind className="w-4 h-4 text-blue-500" />} colorClass="bg-blue-500">
            <div className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-1">Indikasi Utama</dt>
                <dd>Gagal napas hipoksemik akut (Tipe I), post-ekstubasi profilaksis, pre-oksigenasi intubasi.</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Kontraindikasi</dt>
                <dd>Henti napas, tidak mampu melindungi jalan napas, trauma wajah berat.</dd>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-2">Setting Awal</dt>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-[var(--label-secondary)]">Flow</span>
                    <span className="font-bold text-[var(--label-primary)]">40–60 L/mnt</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-[var(--label-secondary)]">FiO₂</span>
                    <span className="font-bold text-[var(--label-primary)]">Target SpO₂ 92–96%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-[var(--label-secondary)]">Suhu</span>
                    <span className="font-bold text-[var(--label-primary)]">37°C</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1.5"><Activity className="w-3 h-3"/> Evaluasi ROX Index</div>
                <div className="text-[var(--label-secondary)]">(SpO₂ / FiO₂) / RR</div>
                <div className="text-xs mt-1 text-[var(--label-primary)]">Diukur jam ke-2, 6, 12. Jika <strong>&lt; 3.85</strong> indikasi intubasi tinggi.</div>
              </div>
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold pt-2 border-t border-slate-200 dark:border-slate-700/50">📚 Roca O. Am J Respir Crit Care Med 2019 (ROX Index)</p>
          </Card>

          <Card title="Non-Invasive Vent (NIV/BiPAP)" icon={<Activity className="w-4 h-4 text-purple-500" />} colorClass="bg-purple-500">
             <div className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-1">Indikasi Utama</dt>
                <dd>Eksaserbasi PPOK (Tipe II hiperkapnik), Edema Paru Kardiogenik akut.</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Kontraindikasi</dt>
                <dd>Apnea, syok tidak stabil, sekresi napas banyak, operasi wajah/GI atas, kesadaran menurun (kecuali koma PPOK murni).</dd>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-2">Setting Awal</dt>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-[var(--label-secondary)]">IPAP</span>
                    <span className="font-bold text-[var(--label-primary)]">10–12 cmH₂O</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-[var(--label-secondary)]">EPAP</span>
                    <span className="font-bold text-[var(--label-primary)]">5–8 cmH₂O</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-[var(--label-secondary)]">FiO₂</span>
                    <span className="font-bold text-[var(--label-primary)]">Target 88-92% PPOK</span>
                  </li>
                </ul>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20">
                <div className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/> Warning</div>
                <div className="text-xs text-[var(--label-primary)]">Jika gagal dalam 1–2 jam (WOB menetap, asidosis memburuk) → Segera Intubasi.</div>
              </div>
            </div>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold pt-2 border-t border-slate-200 dark:border-slate-700/50">📚 BTS/ICS Guidelines for Ventilatory Management 2016</p>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1 mt-8 mb-2">
          <div className="w-1.5 h-5 bg-teal-500 rounded-full" />
          <h2 className="text-[17px] font-bold text-[var(--label-primary)]">
            Lung Protective Ventilation
          </h2>
        </div>

        <Card title="ARDS (Berlin 2012) — ARDSNet Protocol" icon={<Stethoscope className="w-4 h-4 text-teal-500" />} colorClass="bg-teal-500">
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold text-[var(--label-primary)] bg-slate-50 dark:bg-slate-800/50 rounded-tl-xl">Parameter</th>
                  <th className="p-3 font-bold text-[var(--label-primary)] bg-slate-50 dark:bg-slate-800/50">Mild<br/><span className="text-[10px] font-medium text-[var(--label-secondary)] whitespace-nowrap">P/F 200–300</span></th>
                  <th className="p-3 font-bold text-[var(--label-primary)] bg-slate-50 dark:bg-slate-800/50">Moderate<br/><span className="text-[10px] font-medium text-[var(--label-secondary)] whitespace-nowrap">P/F 100–200</span></th>
                  <th className="p-3 font-bold text-[var(--label-primary)] bg-slate-50 dark:bg-slate-800/50 rounded-tr-xl">Severe<br/><span className="text-[10px] font-medium text-[var(--label-secondary)] whitespace-nowrap">P/F &lt;100</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-bold text-[var(--label-primary)]">Mode</td>
                  <td colSpan={3} className="p-3 text-[var(--label-secondary)] font-medium">VC-AC (Volume Control) atau PC-AC. VC lebih terkontrol untuk VT.</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-bold text-[var(--label-primary)]">VT</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">6 mL/kg IBW</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">4–6 mL/kg IBW</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">4–6 mL/kg IBW</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-bold text-[var(--label-primary)]">RR</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">14–20 bpm</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">18–25 bpm</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">20–30 bpm</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-bold text-[var(--label-primary)]">PEEP</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">5–8 cmH₂O</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">8–13 cmH₂O</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">13–18 cmH₂O</td>
                </tr>
                <tr className="bg-rose-50/50 dark:bg-rose-500/5">
                  <td className="p-3 font-bold text-[var(--label-primary)]">Pplat</td>
                  <td colSpan={3} className="p-3 text-[var(--label-primary)] font-bold">≤30 cmH₂O MUTLAK <span className="text-[var(--label-secondary)] font-medium ml-1">· Target ≤28</span></td>
                </tr>
                <tr className="bg-indigo-50/50 dark:bg-indigo-500/5">
                  <td className="p-3 font-bold text-[var(--label-primary)]">Driving Pr.</td>
                  <td colSpan={3} className="p-3 text-indigo-700 dark:text-indigo-400 font-bold">Pplat − PEEP ≤15 cmH₂O <span className="text-[var(--label-secondary)] font-medium ml-1">(target ≤13)</span></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-3 font-bold text-[var(--label-primary)]">PaCO₂ target</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">35–50 mmHg</td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">40–55 <span className="text-[10px] text-[var(--label-tertiary)]">(perm)</span></td>
                  <td className="p-3 text-[var(--label-secondary)] font-medium">45–65 <span className="text-[10px] text-[var(--label-tertiary)]">(perm)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3 rounded-xl mt-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-amber-800 dark:text-amber-400 mb-1">ARDS Severe — Prone Position</div>
              <div className="text-xs text-[var(--label-secondary)] leading-relaxed">Indikasi P/F &lt;150 dengan FiO₂ ≥0.6 selama &gt;12 jam. Lakukan praning 16 jam/hari (Pedomann PROSEVA).</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1 mt-8 mb-2">
          <div className="w-1.5 h-5 bg-amber-500 rounded-full" />
          <h2 className="text-[17px] font-bold text-[var(--label-primary)]">
            Kondisi Spesifik
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="PPOK Eksaserbasi" icon={<Wind className="w-4 h-4 text-amber-500" />} colorClass="bg-amber-500">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs">
              <ul className="space-y-3">
                <li className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-[var(--label-primary)]">Mode</span>
                  <span className="text-[var(--label-secondary)] font-medium">VC-AC (PC-AC memadai)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-[var(--label-primary)]">VT</span>
                  <span className="text-[var(--label-secondary)] font-medium">6–8 mL/kg IBW</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-[var(--label-primary)]">RR</span>
                  <span className="text-[var(--label-secondary)] font-medium">10–14 bpm (RENDAH)</span>
                </li>
                <li className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-bold text-[var(--label-primary)]">I:E</span>
                  <span className="text-[var(--label-secondary)] font-medium">1:3 s/d 1:5</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-bold text-[var(--label-primary)]">PEEP</span>
                  <span className="text-[var(--label-secondary)] font-medium">5–8 cmH₂O (75-85% auto-PEEP)</span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/30">
               <div className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/> Auto-PEEP</div>
               <div className="text-xs text-[var(--label-primary)]">Cek expiratory hold. Jika auto-PEEP &gt;10, kurangi RR & perpanjang I:E. Waspada hipotensi!</div>
            </div>
          </Card>

          <Card title="Syok Septik + Gagal Napas" icon={<Activity className="w-4 h-4 text-rose-500" />} colorClass="bg-rose-500">
             <div className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-2">Timing Intubasi</dt>
                <ul className="space-y-1.5">
                  <li className="flex gap-2"><span className="text-rose-500">•</span> Jangan tunggu apnea — intubasi saat perburukan progresif</li>
                  <li className="flex gap-2"><span className="text-rose-500">•</span> Ketamin (1–1.5 mg/kg IV) pilihan induksi krn minim efek hipotensi</li>
                  <li className="flex gap-2"><span className="text-rose-500">•</span> Siapkan norepinefrin sblm prosedure</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-2">Setting Awal</dt>
                <ul className="space-y-2 text-xs">
                  <li className="flex justify-between items-center border-b border-white/5 pb-1">
                    <span className="text-[var(--label-secondary)]">VT</span>
                    <span className="font-bold text-[var(--label-primary)]">6 mL/kg IBW</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-1">
                     <span className="text-[var(--label-secondary)]">PEEP</span>
                     <span className="font-bold text-[var(--label-primary)]">8–12 cmH₂O</span>
                  </li>
                  <li className="flex justify-between items-center text-[11px] mt-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                     <span className="text-rose-600 dark:text-rose-400 font-bold">Hindari Alkalosis</span>
                     <span className="text-[var(--label-secondary)]">Mencegah vasodilasi perifer</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card title="Edema Paru Kardiogenik" icon={<Heart className="w-4 h-4 text-purple-500" />} colorClass="bg-purple-500">
              <div className="space-y-3 pt-1">
                <div>
                  <div className="text-xs font-bold text-[var(--label-primary)] flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Mulai NIV Dahulu
                  </div>
                  <div className="text-xs text-[var(--label-secondary)] leading-relaxed pl-3.5">
                    CPAP 8–10 cmH₂O atau BiPAP (IPAP 14–18/EPAP 6–8). Efektif menurunkan preload + afterload jantung.
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--label-primary)] flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"/> Intubasi (Bila NIV Gagal)
                  </div>
                  <div className="text-xs text-[var(--label-secondary)] leading-relaxed pl-3.5">
                    Indikasi jika terjadi aritmia atau GCS menurun. Setting: VT 6-8 mL/kg IBW, PEEP 8-12 cmH₂O.
                  </div>
                </div>
                <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg pr-3">
                  ⚠ Titrasi PEEP ekstra hati-hati karena dapat menurunkan preload kardiovaskular secara ekstrim.
                </div>
              </div>
          </Card>

          <Card title="Gagal Neuromuskular" icon={<Brain className="w-4 h-4 text-slate-500" />} colorClass="bg-slate-500">
             <div>
               <dt className="text-xs font-bold text-[var(--label-primary)] uppercase tracking-wider mb-2">Indikasi Intubasi (Rule of 20-30-40)</dt>
               <ul className="space-y-2 text-xs">
                  <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-1.5">
                     <span className="text-[var(--label-secondary)]">Vital Capacity (VC)</span>
                     <span className="font-bold text-[var(--label-primary)]">&lt; 20 mL/kg</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-1.5">
                     <span className="text-[var(--label-secondary)]">MIP / NIF</span>
                     <span className="font-bold text-rose-500">&lt; -30 cmH₂O</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 pb-1.5">
                     <span className="text-[var(--label-secondary)]">MEP</span>
                     <span className="font-bold text-[var(--label-primary)]">&lt; 40 cmH₂O</span>
                  </li>
               </ul>
               <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs text-[var(--label-secondary)] leading-relaxed">
                 Keterlibatan <strong>Bulbar</strong> (tersedak, kehilangan refleks batuk) merupakan indikasi intubasi segera terlepas dari angka VC/MIP/MEP untuk proteksi airway.
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
