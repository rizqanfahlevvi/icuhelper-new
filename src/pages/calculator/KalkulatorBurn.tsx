import React, { useState, useMemo } from 'react';
import { Flame, RotateCcw, Info, Droplets } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { usePatientStore } from '../../store/usePatientStore';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';

// Beautiful organic SVG paths for a human mannequin
const SVG_PATHS = {
  head: "M 85 45 C 85 20, 115 20, 115 45 C 115 65, 108 75, 100 75 C 92 75, 85 65, 85 45 Z",
  neck: "M 92 73 C 100 77, 108 73, 110 85 C 100 87, 90 87, 90 85 Z",
  chest: "M 90 85 C 100 87, 110 85, 125 90 C 135 110, 130 135, 125 145 L 75 145 C 70 135, 65 110, 75 90 Z",
  abdomen: "M 75 145 L 125 145 C 125 145, 125 190, 115 205 C 105 215, 95 215, 85 205 C 75 190, 75 145, 75 145 Z",
  groin: "M 85 205 C 95 215, 105 215, 115 205 C 110 220, 105 235, 100 235 C 95 235, 90 220, 85 205 Z",
  armRight_upper: "M 75 90 C 60 95, 55 130, 58 150 C 65 152, 70 148, 72 140 C 75 125, 75 105, 75 90 Z",
  armRight_lower: "M 58 150 C 50 185, 45 205, 40 215 C 48 220, 55 215, 58 205 C 65 190, 70 160, 65 148 Z",
  armRight_hand: "M 40 215 C 35 230, 30 245, 35 255 C 42 255, 45 245, 48 235 C 50 225, 55 215, 55 215 Z",
  armLeft_upper: "M 125 90 C 140 95, 145 130, 142 150 C 135 152, 130 148, 128 140 C 125 125, 125 105, 125 90 Z",
  armLeft_lower: "M 142 150 C 150 185, 155 205, 160 215 C 152 220, 145 215, 142 205 C 135 190, 130 160, 135 148 Z",
  armLeft_hand: "M 160 215 C 165 230, 170 245, 165 255 C 158 255, 155 245, 152 235 C 150 225, 145 215, 145 215 Z",
  legRight_thigh: "M 85 205 C 70 220, 65 260, 70 295 C 80 300, 88 295, 92 280 C 95 260, 95 235, 100 235 C 95 235, 90 220, 85 205 Z",
  legRight_lower: "M 70 295 C 65 340, 65 380, 70 410 C 80 415, 88 410, 90 380 C 92 340, 90 300, 88 295 Z",
  legRight_foot: "M 70 410 C 65 430, 65 440, 75 445 C 85 445, 90 435, 90 415 Z",
  legLeft_thigh: "M 115 205 C 130 220, 135 260, 130 295 C 120 300, 112 295, 108 280 C 105 260, 105 235, 100 235 C 105 235, 110 220, 115 205 Z",
  legLeft_lower: "M 130 295 C 135 340, 135 380, 130 410 C 120 415, 112 410, 110 380 C 108 340, 110 300, 112 295 Z",
  legLeft_foot: "M 130 410 C 135 430, 135 440, 125 445 C 115 445, 110 435, 110 415 Z"
};

// Lund-Browder calculation function based on age (years)
// Returns percentages for a SINGLE SIDE (Front OR Back)
function getLundBrowderValues(ageYears: number) {
  let A, B, C;
  if (ageYears < 1) { A = 9.5; B = 2.75; C = 2.5; }
  else if (ageYears < 5) { A = 8.5; B = 3.25; C = 2.5; }
  else if (ageYears < 10) { A = 6.5; B = 4.0; C = 2.75; }
  else if (ageYears < 15) { A = 5.5; B = 4.25; C = 3.0; }
  else { A = 3.5; B = 4.75; C = 3.5; } // Adult 15+

  return {
    head: A, // Front or back
    neck: 1, // Front or back
    chest: 6.5,
    abdomen: 6.5,
    upperBack: 6.5,
    lowerBack: 6.5,
    groin: 1, // Usually 1% total, we'll put it on Front
    buttocks: 2.5, // 2.5 each buttock (total 5), we'll put 5 on Back
    upperArm: 2, // Front or back, single side
    lowerArm: 1.5, // Front or back, single side
    hand: 1.25, // Front or back, single side
    thigh: B, // Front or back, single side
    lowerLeg: C, // Front or back, single side
    foot: 1.75, // Front or back, single side
  };
}

type PartKey = keyof typeof SVG_PATHS;

export default function KalkulatorBurn() {
  const { 
    activePatientId 
  } = usePatientStore();

  const [selectedPartsFront, setSelectedPartsFront] = useState<Set<PartKey>>(new Set());
  const [selectedPartsBack, setSelectedPartsBack] = useState<Set<PartKey>>(new Set());
  
  const [localWeight, setLocalWeight] = useState<string>('70');
  const [localAge, setLocalAge] = useState<number>(30); // Default adult age
  const [factor, setFactor] = useState<string>('4');

  const handleAutofill = (data: { weightKg: string; heightCm?: string; age?: string; gender?: string }) => {
    if (data.weightKg) setLocalWeight(data.weightKg);
    if (data.age) setLocalAge(parseInt(data.age, 10) || 30);
  };

  const togglePart = (id: PartKey, isFront: boolean) => {
    const setter = isFront ? setSelectedPartsFront : setSelectedPartsBack;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const lundBrowder = useMemo(() => getLundBrowderValues(localAge), [localAge]);

  const tbsa = useMemo(() => {
    let total = 0;
    const calc = (part: PartKey, isFront: boolean) => {
      switch (part) {
        case 'head': total += lundBrowder.head; break;
        case 'neck': total += lundBrowder.neck; break;
        case 'chest': total += isFront ? lundBrowder.chest : lundBrowder.upperBack; break; // Reusing chest path for upper back
        case 'abdomen': total += isFront ? lundBrowder.abdomen : lundBrowder.lowerBack; break; // Reusing abdomen path for lower back
        case 'groin': total += isFront ? lundBrowder.groin : 5; break; // Reusing groin path for buttocks on back (total 5%)
        case 'armRight_upper': case 'armLeft_upper': total += lundBrowder.upperArm; break;
        case 'armRight_lower': case 'armLeft_lower': total += lundBrowder.lowerArm; break;
        case 'armRight_hand': case 'armLeft_hand': total += lundBrowder.hand; break;
        case 'legRight_thigh': case 'legLeft_thigh': total += lundBrowder.thigh; break;
        case 'legRight_lower': case 'legLeft_lower': total += lundBrowder.lowerLeg; break;
        case 'legRight_foot': case 'legLeft_foot': total += lundBrowder.foot; break;
      }
    };

    selectedPartsFront.forEach(p => calc(p, true));
    selectedPartsBack.forEach(p => calc(p, false));
    return total;
  }, [selectedPartsFront, selectedPartsBack, lundBrowder]);

  const fluidVolume = useMemo(() => {
    const w = parseFloat(localWeight) || 0;
    const f = parseFloat(factor) || 0;
    return w * f * tbsa;
  }, [localWeight, factor, tbsa]);

  const getStyle = (id: PartKey, isFront: boolean) => {
    const set = isFront ? selectedPartsFront : selectedPartsBack;
    return set.has(id) 
      ? "fill-red-500/90 stroke-red-700 cursor-pointer hover:fill-red-400/90 transition-colors"
      : "fill-slate-100 dark:fill-[#2C2C2E] stroke-slate-300 dark:stroke-slate-600 cursor-pointer hover:fill-slate-200 dark:hover:fill-slate-700 transition-colors";
  };

  const renderSVG = (isFront: boolean) => {
    return (
      <svg viewBox="0 0 200 460" className="w-full max-w-[180px] drop-shadow-md">
        {Object.entries(SVG_PATHS).map(([key, path]) => {
          const partKey = key as PartKey;
          return (
            <path
              key={partKey}
              d={path}
              className={getStyle(partKey, isFront)}
              strokeWidth="2"
              strokeLinejoin="round"
              onClick={() => togglePart(partKey, isFront)}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      <PageHeader 
        badgeIcon={Flame}
        badgeText="LUKA BAKAR"
        title="Lund-Browder TBSA"
        description="Perhitungan luas luka bakar interaktif dengan formula Lund-Browder (tersinkronisasi dengan usia pasien) dan resusitasi cairan."
      />

      <ActivePatientBriefCard onAutofill={handleAutofill} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Interactive SVG Area */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between w-full items-center mb-8">
            <h3 className="font-semibold text-foreground text-lg">Pemetaan 3D Visual</h3>
            <button 
              onClick={() => { setSelectedPartsFront(new Set()); setSelectedPartsBack(new Set()); }}
              className="text-xs font-medium flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
          
          <div className="flex w-full justify-around items-start gap-4 flex-1">
            {/* FRONT MANNEQUIN */}
            <div className="flex flex-col items-center gap-6 w-1/2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">Anterior</span>
              {renderSVG(true)}
            </div>

            {/* BACK MANNEQUIN */}
            <div className="flex flex-col items-center gap-6 w-1/2">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">Posterior</span>
              {renderSVG(false)}
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between w-full bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/20">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-red-800 dark:text-red-300">Total TBSA</span>
              <p className="text-xs text-red-600/70 dark:text-red-400/70">Terkalkulasi berdasar usia ({localAge} thn)</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-red-600 dark:text-red-400">{tbsa.toFixed(1)}</span>
              <span className="text-lg font-bold text-red-600/70 dark:text-red-400/70">%</span>
            </div>
          </div>
        </div>

        {/* Resuscitation Calculation Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#3A7CA5]" />
              Resusitasi Cairan
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={localAge}
                    onChange={(e) => setLocalAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]/40 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Berat Badan</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={localWeight}
                      onChange={(e) => setLocalWeight(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#2C2C2E] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-[#3A7CA5]/40 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">kg</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Target (mL/kg/%TBSA)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map(val => (
                    <button
                      key={val}
                      onClick={() => setFactor(val.toString())}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                        factor === val.toString()
                          ? 'bg-[#3A7CA5] text-white shadow-md'
                          : 'bg-slate-100 dark:bg-[#2C2C2E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {val} mL
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2 items-start text-[11px] text-muted-foreground bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                  <p>Pedoman ATLS: Dewasa termal = 2 mL, Anak = 3 mL, Luka bakar listrik = 4 mL.</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-gradient-to-br from-[#3A7CA5]/10 to-[#3A7CA5]/5 rounded-2xl p-5 border border-[#3A7CA5]/20">
                <div className="flex flex-col mb-5">
                  <span className="text-sm font-semibold text-[#3A7CA5]">Total Cairan 24 Jam</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-[#3A7CA5]">{fluidVolume.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                    <span className="text-sm font-bold text-[#3A7CA5]/70">mL / 24j</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-[#3A7CA5]/20">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3A7CA5]"></div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">8 Jam Pertama</span>
                    </div>
                    <span className="font-bold text-foreground">{(fluidVolume / 2).toLocaleString(undefined, {maximumFractionDigits:0})} mL</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3A7CA5]/40"></div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">16 Jam Berikutnya</span>
                    </div>
                    <span className="font-bold text-foreground">{(fluidVolume / 2).toLocaleString(undefined, {maximumFractionDigits:0})} mL</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#3A7CA5]/20">
                  <SaveToHistoryButton 
                    module="burn" 
                    label={`Resusitasi Luka Bakar — ${tbsa.toFixed(1)}% TBSA`}
                    inputs={{ age: localAge, weight: localWeight, factor, tbsa, selectedFront: Array.from(selectedPartsFront), selectedBack: Array.from(selectedPartsBack) }}
                    summary={`TBSA: ${tbsa.toFixed(1)}% · Total: ${fluidVolume.toLocaleString(undefined, {maximumFractionDigits:0})} mL/24j · 8j Pertama: ${(fluidVolume / 2).toLocaleString(undefined, {maximumFractionDigits:0})} mL`}
                    className="w-full bg-[#3A7CA5] hover:bg-[#2c6182]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Accordion title="📖 Teori & Referensi: Lund-Browder & Resusitasi Cairan">
        <ul className="pl-4 space-y-2 mb-4 list-disc text-slate-600 dark:text-slate-400 text-[13px] leading-relaxed">
          <li><strong>Lund-Browder Chart:</strong> Merupakan metode paling akurat untuk mengestimasi luas luka bakar (%TBSA) karena memperhitungkan proporsi anatomi yang berubah seiring bertambahnya usia, terutama kepala dan kaki pada anak.</li>
          <li><strong>Resusitasi Cairan (Parkland / Modified Brooke):</strong> Ringer Laktat adalah cairan pilihan.
            <ul className="list-[circle] pl-4 mt-1 space-y-1">
              <li>Dewasa (Luka bakar termal/kimia): <strong>2 mL</strong> × BB × %TBSA</li>
              <li>Anak &lt; 14 tahun: <strong>3 mL</strong> × BB × %TBSA</li>
              <li>Luka bakar listrik (Semua umur): <strong>4 mL</strong> × BB × %TBSA</li>
            </ul>
          </li>
          <li><strong>Pemberian:</strong> 50% dari total cairan diberikan dalam 8 jam pertama (dihitung dari waktu kejadian luka bakar, BUKAN waktu kedatangan di RS). Sisa 50% diberikan dalam 16 jam berikutnya.</li>
          <li><strong>Target Monitor:</strong> Resusitasi dititrasi berdasarkan Urine Output (UO). Dewasa: 0.5 mL/kg/jam. Anak &lt; 30 kg: 1 mL/kg/jam. Luka bakar listrik: 1-1.5 mL/kg/jam.</li>
        </ul>
        <div className="mt-4 p-4 bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-[13px] text-slate-700 dark:text-slate-300 italic">
          📚 American Burn Association (ABA). Advanced Burn Life Support (ABLS) Provider Manual. 2018.
        </div>
      </Accordion>
    </div>
  );
}
