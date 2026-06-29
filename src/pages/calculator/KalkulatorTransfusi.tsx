import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  Beaker, 
  Heart, 
  Snowflake, 
  Info, 
  ChevronDown,
  RefreshCw,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Accordion } from '../../components/ui/Accordion';
import { SaveToHistoryButton } from '../../components/ui/SaveToHistoryButton';
import { ActivePatientBriefCard } from '../../components/ActivePatientBriefCard';
import { UnifiedSyncBanner } from '../../components/UnifiedSyncBanner';
import { usePatientStore } from '../../store/usePatientStore';
import { useClinicalStore } from '../../store/useClinicalStore';

interface TransfusiResult {
  type: 'prc' | 'wb' | 'ffp' | 'tc' | 'cryo';
  kolf?: number;
  vol?: number;
  dhb?: number;           // delta Hb
  ebv?: number;           // mL
  units?: number;         // untuk TC RD / SDA
  subtype?: 'rd' | 'sda';
  minExpectedPltRise?: number;
  maxExpectedPltRise?: number;
  deficit?: number;       // fibrinogen deficit mg
  dose?: number;          // mL/kg untuk FFP
  inr?: number;           // INR jika diisi
  premed?: string;        // premedikasi yang dipilih
  premednote?: string;    // rekomendasi dosis premedikasi
}

export default function KalkulatorTransfusi() {
  const patient = usePatientStore();
  const clinicalStore = useClinicalStore();

  // Tab selection
  const [tab, setTab] = useState<'prc' | 'wb' | 'ffp' | 'tc' | 'cryo'>('prc');

  // Shared parameters
  const [bb, setBb] = useState('');
  const [sex, setSex] = useState('m'); // 'm' | 'f'

  // PRC & WB
  const [hb, setHb] = useState('');
  const [hbt, setHbt] = useState('');
  const [premed, setPremed] = useState('none');

  // FFP
  const [ffpDose, setFfpDose] = useState('15');   // mL/kg
  const [ffpInr, setFfpInr] = useState('');

  // TC
  const [tcPlt, setTcPlt] = useState('');
  const [tcPltt, setTcPltt] = useState('');
  const [tcType, setTcType] = useState<'rd' | 'sda'>('rd');

  // Cryo
  const [cryoFib, setCryoFib] = useState('');
  const [cryoFibUnit, setCryoFibUnit] = useState<'mgdl' | 'gdl'>('mgdl');
  const [cryoTarget, setCryoTarget] = useState('150');

  // Calculation Results & Error states
  const [res, setRes] = useState<TransfusiResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-loaded on mount
  useEffect(() => {
    const parentWeight = patient.weightKg || clinicalStore.data.weight || '';
    if (parentWeight) setBb(String(parentWeight));

    if (clinicalStore.data.hb) setHb(String(clinicalStore.data.hb));
    if (clinicalStore.data.trombosit) setTcPlt(String(clinicalStore.data.trombosit));

    const parentGender = patient.gender || clinicalStore.data.gender || '';
    if (parentGender) {
      setSex(parentGender.toLowerCase() === 'p' || parentGender.toLowerCase() === 'f' ? 'f' : 'm');
    }
  }, []);

  // Sync field definition for UnifiedSyncBanner
  const syncFields = useMemo(() => [
    { key: 'weight' as const, label: 'Berat Badan', value: bb, setter: setBb, unit: 'kg' },
    { key: 'hb' as const, label: 'Hemoglobin', value: hb, setter: setHb, unit: 'g/dL' },
    { key: 'trombosit' as const, label: 'Trombosit', value: tcPlt, setter: setTcPlt, unit: '10³/µL' },
  ], [bb, hb, tcPlt]);

  // Handle autofill when a patient from brief card is selected
  const handleAutofill = (data: { weightKg: string; gender?: string }) => {
    if (data.weightKg) setBb(data.weightKg);
    if (data.gender) setSex(data.gender.toLowerCase() === 'p' || data.gender.toLowerCase() === 'f' ? 'f' : 'm');

    if (clinicalStore.data.hb) setHb(String(clinicalStore.data.hb));
    if (clinicalStore.data.trombosit) setTcPlt(String(clinicalStore.data.trombosit));

    setRes(null);
    setValidationError(null);
  };

  // Premedication notes mapping
  const premedNotes: Record<string, string> = {
    none: "Tanpa premedikasi rutin. Monitor tanda vital setiap 15 menit.",
    furosemide: "Furosemide 20 mg IV pelan sebelum atau di sela kolf. Diindikasikan untuk pasien dengan risiko tinggi TACO (lansia, CHF, CKD, volume overload).",
    diph_dexa: "Diphenhydramine 25–50 mg IV + Dexamethasone 4–8 mg IV diberikan 30 menit sebelum transfusi dimulai. Diindikasikan bagi pasien dengan riwayat reaksi alergi transfusi berulang.",
    dexa: "Dexamethasone 4–10 mg IV diberikan 30 menit sebelum transfusi dimulai. Diindikasikan bagi pasien dengan riwayat reaksi alergi sedang-berat."
  };

  // Perform calculation
  const calculate = () => {
    setValidationError(null);
    const w = parseFloat(bb);
    if (!w || isNaN(w)) {
      setValidationError("Berat Badan (BB) wajib diisi dengan angka yang valid.");
      return;
    }

    if (tab === 'prc') {
      const h1 = parseFloat(hb);
      const h2 = parseFloat(hbt);
      if (isNaN(h1) || isNaN(h2)) {
        setValidationError("Hemoglobin (Hb) Aktual dan Target Hb wajib diisi.");
        return;
      }
      if (h2 <= h1) {
        setValidationError("Target Hb harus lebih besar daripada Hb Aktual.");
        return;
      }

      const dhb = h2 - h1;
      // Formula Davies 2007 with default Indonesian factor k=4 (assuming PRC Hematocrit ≈ 70-75%)
      const vol = dhb * w * 4;
      const kolf = Math.ceil(vol / 250); // 1 kolf PRC estimated at 250 mL
      const ebv = w * (sex === 'm' ? 70 : 65);

      setRes({
        type: 'prc',
        vol,
        kolf,
        dhb,
        ebv,
        premed,
        premednote: premedNotes[premed]
      });

    } else if (tab === 'wb') {
      const h1 = parseFloat(hb);
      const h2 = parseFloat(hbt);
      if (isNaN(h1) || isNaN(h2)) {
        setValidationError("Hemoglobin (Hb) Aktual dan Target Hb wajib diisi.");
        return;
      }
      if (h2 <= h1) {
        setValidationError("Target Hb harus lebih besar daripada Hb Aktual.");
        return;
      }

      const dhb = h2 - h1;
      // Formula k=6 (WB Hematocrit ≈ 38-45%)
      const vol = dhb * w * 6;
      const kolf = Math.ceil(vol / 450); // 1 kolf WB estimated at 450 mL

      setRes({
        type: 'wb',
        vol,
        kolf,
        dhb
      });

    } else if (tab === 'ffp') {
      const d = parseInt(ffpDose);
      const vol = d * w;
      const kolf = Math.ceil(vol / 250); // 1 kolf FFP estimated at 250 mL
      const inrVal = ffpInr ? parseFloat(ffpInr) : undefined;

      setRes({
        type: 'ffp',
        vol,
        kolf,
        dose: d,
        inr: inrVal
      });

    } else if (tab === 'tc') {
      const p1 = parseFloat(tcPlt);
      const p2 = parseFloat(tcPltt);
      if (isNaN(p1) || isNaN(p2)) {
        setValidationError("Trombosit Aktual dan Target Trombosit wajib diisi.");
        return;
      }
      if (p2 <= p1) {
        setValidationError("Target Trombosit harus lebih besar daripada Trombosit Aktual.");
        return;
      }

      if (tcType === 'rd') {
        // Rule of thumb: 1 unit RD / 10 kg BB (min 4, max 10)
        const units = Math.max(4, Math.min(Math.ceil(w / 10), 10));
        const vol = units * 60; // 1 unit RD ≈ 60 mL
        // Expected rise: 5.000 - 10.000 / unit, normalized to 70 kg BB
        const minExpectedPltRise = Math.round((5000 * units) / (w / 70));
        const maxExpectedPltRise = Math.round((10000 * units) / (w / 70));

        setRes({
          type: 'tc',
          subtype: 'rd',
          units,
          vol,
          minExpectedPltRise,
          maxExpectedPltRise
        });
      } else {
        // SDA (Apheresis)
        const vol = 250; // 1 kantong SDA ≈ 250 mL (equivalent to 4-6 RD)
        // Expected rise: 30.000 - 60.000, normalized to 70 kg BB
        const minExpectedPltRise = Math.round(30000 / (w / 70));
        const maxExpectedPltRise = Math.round(60000 / (w / 70));

        setRes({
          type: 'tc',
          subtype: 'sda',
          units: 1,
          vol,
          minExpectedPltRise,
          maxExpectedPltRise
        });
      }

    } else if (tab === 'cryo') {
      const f1 = parseFloat(cryoFib);
      if (isNaN(f1)) {
        setValidationError("Fibrinogen Aktual wajib diisi.");
        return;
      }
      const f2 = parseFloat(cryoTarget); // target from dropdown (150, 200, 100)

      // Convert unit if g/L is selected (1 g/L = 100 mg/dL)
      const f1_mgdl = cryoFibUnit === 'gdl' ? f1 * 100 : f1;

      if (f2 <= f1_mgdl) {
        setValidationError(`Fibrinogen Aktual (${f1_mgdl} mg/dL) sudah mencapai atau melebihi Target (${f2} mg/dL). Koreksi tidak diperlukan.`);
        return;
      }

      const pv = w * 40; // Plasma volume estimated at 40 mL/kg
      const deficit = ((f2 - f1_mgdl) * pv) / 100; // Deficit in mg
      const kForm = Math.ceil(deficit / 200); // 1 kolf Cryoprecipitate contains ≈ 200 mg Fibrinogen
      const kRule = Math.ceil(w / 10); // Rule of thumb: 1 kolf / 10 kg BB
      const kolf = Math.max(kForm, kRule);
      const vol = kolf * 17; // 1 kolf Cryo ≈ 15-20 mL (avg 17 mL)

      setRes({
        type: 'cryo',
        deficit,
        kolf,
        vol
      });
    }
  };

  // Dynamic dosage suggestion helper based on INR input for FFP
  useEffect(() => {
    if (tab === 'ffp' && ffpInr) {
      const inrVal = parseFloat(ffpInr);
      if (!isNaN(inrVal)) {
        if (inrVal >= 1.5 && inrVal <= 2.0) {
          setFfpDose('15');
        } else if (inrVal > 2.0 && inrVal <= 3.0) {
          setFfpDose('20');
        } else if (inrVal > 3.0) {
          setFfpDose('30');
        }
      }
    }
  }, [ffpInr, tab]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 overflow-x-hidden">
      
      {/* Active Patient Widget & Sync Banner */}
      <ActivePatientBriefCard onAutofill={handleAutofill} />
      <UnifiedSyncBanner fields={syncFields} />

      {/* Product Tab Bar */}
      <div className="flex bg-slate-100 dark:bg-[#2C2C2E] p-1 rounded-xl w-full max-w-2xl mx-auto shadow-sm mb-4">
        {(['prc', 'wb', 'ffp', 'tc', 'cryo'] as const).map((t) => (
          <button 
            key={t}
            className={`flex-1 py-2 text-[12px] md:text-[13px] font-bold rounded-lg transition-all ${tab === t ? 'bg-white dark:bg-[#1C1C1E] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`} 
            onClick={() => {
              setTab(t); 
              setRes(null);
              setValidationError(null);
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Calculation Card */}
      <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        
        {/* Dynamic Card Header */}
        <div className="flex items-start gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-red-500/10 dark:bg-red-500/5">
            <Droplets className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {tab === 'prc' && "Kalkulator PRC (Packed Red Cells)"}
              {tab === 'wb' && "Kalkulator WB (Whole Blood)"}
              {tab === 'ffp' && "Kalkulator FFP (Fresh Frozen Plasma)"}
              {tab === 'tc' && "Kalkulator TC (Thrombocyte Concentrate)"}
              {tab === 'cryo' && "Kalkulator Cryoprecipitate"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {tab === 'prc' && "Menghitung kebutuhan eritrosit dengan faktor koreksi klinis k=4."}
              {tab === 'wb' && "Menghitung kebutuhan darah utuh. Hanya diindikasikan pada perdarahan masif akut."}
              {tab === 'ffp' && "Menghitung dosis plasma beku segar untuk mengatasi defisiensi faktor koagulasi."}
              {tab === 'tc' && "Menghitung kebutuhan trombosit donor acak atau single donor apheresis."}
              {tab === 'cryo' && "Menghitung kolf cryoprecipitate berdasarkan defisit fibrinogen plasma."}
            </p>
          </div>
        </div>

        {/* Form Inputs Container */}
        <div className="space-y-4">
          
          {/* 1. Shared Weight Parameter */}
          <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
            <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Berat Badan Pasien</span>
            <div className="flex items-center gap-2">
              <input 
                id="bb_transfusion"
                type="number" 
                className="w-28 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                value={bb} 
                onChange={e => { setBb(e.target.value); setRes(null); }} 
                placeholder="cth: 70" 
              />
              <span className="text-xs font-semibold text-slate-500 w-6">kg</span>
            </div>
          </div>

          {/* 2. PRC & WB Specific Inputs */}
          {(tab === 'prc' || tab === 'wb') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Hemoglobin (Hb) Aktual</span>
                <div className="flex items-center gap-2">
                  <input 
                    id="hb_actual"
                    type="number" 
                    step="0.1" 
                    className="w-28 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                    value={hb} 
                    onChange={e => { setHb(e.target.value); setRes(null); }} 
                    placeholder="cth: 6.5" 
                  />
                  <span className="text-xs font-semibold text-slate-500 w-6">g/dL</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Target Hemoglobin (Hb)</span>
                <div className="flex items-center gap-2">
                  <input 
                    id="hb_target"
                    type="number" 
                    step="0.1" 
                    className="w-28 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                    value={hbt} 
                    onChange={e => { setHbt(e.target.value); setRes(null); }} 
                    placeholder="cth: 9.0" 
                  />
                  <span className="text-xs font-semibold text-slate-500 w-6">g/dL</span>
                </div>
              </div>

              {tab === 'prc' && (
                <>
                  <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Jenis Kelamin (untuk EBV)</span>
                    <select 
                      id="gender_prc"
                      className="w-36 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-sm" 
                      value={sex} 
                      onChange={e => { setSex(e.target.value); setRes(null); }}
                    >
                      <option value="m">Laki-laki</option>
                      <option value="f">Perempuan</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Rekomendasi Premedikasi</span>
                    <select 
                      id="premed_selection"
                      className="w-48 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-sm" 
                      value={premed} 
                      onChange={e => { setPremed(e.target.value); setRes(null); }}
                    >
                      <option value="none">Tidak ada rutin</option>
                      <option value="furosemide">Furosemide 20 mg IV</option>
                      <option value="diph_dexa">Diphenhydramine + Dexa</option>
                      <option value="dexa">Dexamethasone IV</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 3. FFP Specific Inputs */}
          {tab === 'ffp' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">INR Aktual <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">(opsional)</span></span>
                <input 
                  id="ffp_inr_input"
                  type="number" 
                  step="0.1" 
                  className="w-28 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                  value={ffpInr} 
                  onChange={e => { setFfpInr(e.target.value); setRes(null); }} 
                  placeholder="cth: 2.5" 
                />
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Dosis yang Diinginkan</span>
                <select 
                  id="ffp_dose_selection"
                  className="w-56 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-sm" 
                  value={ffpDose} 
                  onChange={e => { setFfpDose(e.target.value); setRes(null); }}
                >
                  <option value="10">Koagulopati ringan (10 mL/kg)</option>
                  <option value="15">Koreksi INR standar (15 mL/kg)</option>
                  <option value="20">Kondisi DIC aktif (20 mL/kg)</option>
                  <option value="30">Reversal cepat / MTP (30 mL/kg)</option>
                </select>
              </div>

              {ffpInr && parseFloat(ffpInr) < 1.5 && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-3 rounded-xl text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Peringatan Klinis:</strong> FFP umumnya tidak efektif untuk mengoreksi gangguan koagulasi ringan dengan INR &lt; 1.5. Pertimbangkan pemberian Prothrombin Complex Concentrate (PCC) jika tersedia secara klinis.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. TC Specific Inputs */}
          {tab === 'tc' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Trombosit Aktual</span>
                <div className="flex items-center gap-2">
                  <input 
                    id="tc_plt_actual"
                    type="number" 
                    className="w-28 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                    value={tcPlt} 
                    onChange={e => { setTcPlt(e.target.value); setRes(null); }} 
                    placeholder="cth: 15" 
                  />
                  <span className="text-[10px] font-bold text-slate-500 w-12">×10³/μL</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Target Trombosit</span>
                <div className="flex items-center gap-2">
                  <input 
                    id="tc_plt_target"
                    type="number" 
                    className="w-28 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                    value={tcPltt} 
                    onChange={e => { setTcPltt(e.target.value); setRes(null); }} 
                    placeholder="cth: 50" 
                  />
                  <span className="text-[10px] font-bold text-slate-500 w-12">×10³/μL</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Tipe Sediaan Produk</span>
                <select 
                  id="tc_type_selection"
                  className="w-48 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-sm" 
                  value={tcType} 
                  onChange={e => { setTcType(e.target.value as 'rd' | 'sda'); setRes(null); }}
                >
                  <option value="rd">Random Donor (RD)</option>
                  <option value="sda">Apheresis / Single Donor (SDA)</option>
                </select>
              </div>

              {/* Inline Trigger Guidance */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs bg-slate-50/50 dark:bg-slate-900/10 mt-2">
                <div className="bg-slate-100 dark:bg-[#2C2C2E] p-2 font-bold text-slate-700 dark:text-slate-300 text-[10px] uppercase tracking-wider">
                  Panduan Threshold Transfusi Trombosit (AABB)
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-2 flex justify-between">
                    <span className="font-medium text-slate-600 dark:text-slate-400">&lt; 10.000 ×10³/μL</span>
                    <span className="font-bold text-red-600 dark:text-red-400">Profilaksis rutin (pasien stabil)</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-medium text-slate-600 dark:text-slate-400">&lt; 20.000 ×10³/μL</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Sebelum prosedur invasif minor</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-medium text-slate-600 dark:text-slate-400">&lt; 50.000 ×10³/μL</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">Sebelum operasi umum / perdarahan sedang</span>
                  </div>
                  <div className="p-2 flex justify-between">
                    <span className="font-medium text-slate-600 dark:text-slate-400">&lt; 100.000 ×10³/μL</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Sebelum bedah saraf atau bedah mata</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Cryoprecipitate Specific Inputs */}
          {tab === 'cryo' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Fibrinogen Aktual</span>
                <div className="flex items-center gap-2">
                  <input 
                    id="cryo_fib_actual"
                    type="number" 
                    step="0.01"
                    className="w-24 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-2.5 py-1.5 text-right font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 text-sm" 
                    value={cryoFib} 
                    onChange={e => { setCryoFib(e.target.value); setRes(null); }} 
                    placeholder="cth: 100" 
                  />
                  <select 
                    id="cryo_unit"
                    className="bg-slate-100 dark:bg-[#2C2C2E] border-none rounded-lg py-1.5 px-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    value={cryoFibUnit}
                    onChange={e => { setCryoFibUnit(e.target.value as 'mgdl' | 'gdl'); setRes(null); }}
                  >
                    <option value="mgdl">mg/dL</option>
                    <option value="gdl">g/L</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-[#2C2C2E]/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Target Fibrinogen</span>
                <select 
                  id="cryo_target_selection"
                  className="w-56 bg-slate-100/80 dark:bg-white/5 border-none rounded-lg px-3 py-1.5 text-right font-bold text-slate-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50 text-sm" 
                  value={cryoTarget} 
                  onChange={e => { setCryoTarget(e.target.value); setRes(null); }}
                >
                  <option value="150">150 mg/dL (Target Umum / DIC)</option>
                  <option value="200">200 mg/dL (Perdarahan Obstetrik / Masif)</option>
                  <option value="100">100 mg/dL (Ambang Batas Minimum)</option>
                </select>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                <strong>Catatan Fibrinogen:</strong> Konversi unit adalah otomatis (1 g/L = 100 mg/dL). Formula menghitung defisit total plasma volume dan menetapkan volume Cryo yang dibutuhkan.
              </div>
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button 
            id="calculate_btn"
            onClick={calculate} 
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-sm hover:shadow active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Hitung Kebutuhan Transfusi</span>
          </button>
        </div>
      </div>

      {/* Calculation Output Card (Result Block) */}
      {res && (
        <div className="bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="p-4 bg-slate-50 dark:bg-[#2C2C2E]/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hasil Kalkulasi Transfusi</span>
            <span className="text-[10px] font-extrabold bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">PASIEN AKTIF</span>
          </div>

          <div className="p-5 space-y-5">
            
            {/* Standardized Blood volume units indicator layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Box 1: Core volume & bags quantity */}
              <div className="bg-red-500/5 dark:bg-red-500/[0.02] border border-red-500/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-extrabold text-red-500 dark:text-red-400/80 uppercase tracking-wider">ESTIMASI KEBUTUHAN</span>
                <div className="font-mono text-3xl md:text-4xl font-extrabold text-red-600 dark:text-red-500 mt-1">
                  {res.type === 'tc' ? res.units : res.kolf}
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1.5">
                    {res.type === 'tc' ? (res.subtype === 'rd' ? 'unit RD' : 'kantong SDA') : 'kolf'}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
                  Volume Total: ±{Math.round(res.vol || 0)} mL
                </span>
              </div>

              {/* Box 2: Expected Clinical Target Delta Rise */}
              <div className="bg-slate-50 dark:bg-[#2C2C2E]/40 border border-slate-100 dark:border-slate-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">KENAIKAN KLINIS DIHARAPKAN</span>
                
                {res.type === 'prc' && (
                  <div className="mt-1">
                    <div className="font-mono text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200">
                      +{res.dhb?.toFixed(1)} <span className="text-xs font-semibold text-slate-500">g/dL</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">
                      EBV Pasien: {((res.ebv || 0) / 1000).toFixed(2)} L
                    </span>
                  </div>
                )}

                {res.type === 'wb' && (
                  <div className="mt-1">
                    <div className="font-mono text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200">
                      +{res.dhb?.toFixed(1)} <span className="text-xs font-semibold text-slate-500">g/dL</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 mt-0.5 block">
                      Menggunakan WB Hematokrit ±38-45%
                    </span>
                  </div>
                )}

                {res.type === 'ffp' && (
                  <div className="mt-1">
                    <div className="font-mono text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-200">
                      Koreksi Koagulopati
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                      Dosis: {res.dose} mL/kgBB
                    </span>
                  </div>
                )}

                {res.type === 'tc' && (
                  <div className="mt-1">
                    <div className="font-mono text-lg md:text-xl font-extrabold text-slate-800 dark:text-slate-200">
                      +{res.minExpectedPltRise?.toLocaleString()} s/d +{res.maxExpectedPltRise?.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                      Kenaikan per μL (Terstandarisasi BB)
                    </span>
                  </div>
                )}

                {res.type === 'cryo' && (
                  <div className="mt-1">
                    <div className="font-mono text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-200">
                      Koreksi Fibrinogen
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block">
                      Defisit Plasma Total: {Math.round(res.deficit || 0)} mg
                    </span>
                  </div>
                )}

              </div>
            </div>

            {/* Sub-result Detailed Information Blocks */}
            <div className="bg-slate-50 dark:bg-[#2C2C2E]/20 rounded-xl p-4 space-y-3.5 border border-slate-100 dark:border-slate-800">
              
              {/* Formula & Method Statement */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Formula yang Digunakan</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-mono mt-1">
                  {res.type === 'prc' && `Volume (mL) = ΔHb (${res.dhb?.toFixed(1)}) × BB (${bb}) × 4 = ${Math.round(res.vol || 0)} mL`}
                  {res.type === 'wb' && `Volume (mL) = ΔHb (${res.dhb?.toFixed(1)}) × BB (${bb}) × 6 = ${Math.round(res.vol || 0)} mL`}
                  {res.type === 'ffp' && `Volume (mL) = Dosis (${res.dose} mL/kg) × BB (${bb}) = ${Math.round(res.vol || 0)} mL`}
                  {res.type === 'tc' && (res.subtype === 'rd' ? `Sediaan RD: Min 4, Max 10 unit | BB / 10 = ${Math.ceil(parseFloat(bb) / 10)} unit` : "Sediaan Apheresis: Standard 1 Kantong (Setara 4-6 unit donor acak)")}
                  {res.type === 'cryo' && `Fibrinogen Defisit (mg) = (Target - Aktual) × Plasma Volume (BB × 40) / 100`}
                </p>
                <span className="text-[10px] text-slate-500 italic mt-0.5 block">
                  {res.type === 'prc' && "ℹ️ Faktor k=4 mengasumsikan Hct PRC ±70-75% sesuai spesifikasi umum BDRS di Indonesia."}
                  {res.type === 'wb' && "⚠️ WB jarang tersedia di unit darah. WB hanya dianjurkan untuk perdarahan masif akut."}
                  {res.type === 'ffp' && "ℹ️ Target FFP adalah pemulihan status faktor pembekuan darah."}
                  {res.type === 'tc' && "ℹ️ Efek kenaikan trombosit bervariasi bergantung pada splenomegali, demam, dan sepsis."}
                  {res.type === 'cryo' && "ℹ️ 1 kolf Cryoprecipitate mengandung rata-rata 200 mg fibrinogen fungsional."}
                </span >
              </div>

              {/* Premedication advice block */}
              {res.type === 'prc' && res.premednote && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Rekomendasi Premedikasi</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium bg-white dark:bg-[#1C1C1E] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    {res.premednote}
                  </p>
                </div>
              )}

              {/* Critical threshold / Restrictive clinical warning */}
              {res.type === 'prc' && parseFloat(hb) >= 7.0 && (
                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800/80">
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-xs flex gap-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                    <div>
                      <strong>Pertimbangan Threshold Restriktif (AABB):</strong> Hb aktual pasien ≥ 7.0 g/dL. Pada pasien ICU yang stabil (tanpa sindrom koroner akut, penyakit kardiovaskular berat, atau perdarahan aktif masif), strategi transfusi restriktif dengan ambang batas <strong>Hb &lt; 7.0 g/dL</strong> terbukti aman dan meminimalkan komplikasi transfusi.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
               <SaveToHistoryButton 
                 module="transfusi" 
                 label={`Transfusi: ${res.type.toUpperCase()}`}
                 inputs={{ tab, bb, sex, hb, hbt, tcPlt, tcPltt, tcType, ffpDose, ffpInr, cryoFib, cryoTarget }}
                 summary={`Butuh ${res.type === 'tc' ? res.units : res.kolf} ${res.type === 'tc' ? (res.subtype === 'rd' ? 'unit RD' : 'kantong SDA') : 'kolf'} (±${Math.round(res.vol || 0)} mL)`}
                 className="w-full"
               />
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CLINICAL THEORY ACCORDIONS */}
      <div className="space-y-4">
        
        {/* Accordion 1: Product Specifications Reference Table */}
        <Accordion title="📋 Referensi Cepat — Spesifikasi Produk Darah">
          <div className="space-y-4 w-full">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                Berikut adalah karakteristik fisik dan parameter klinis standar produk komponen darah yang dikelola oleh BDRS di Indonesia sesuai PMK No. 91 Tahun 2015.
              </p>
              
              {/* Mobile View: Stacked Cards */}
              <div className="md:hidden space-y-3">
                {productSpecs.map((p) => (
                  <div key={p.name} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                      <span className="font-bold text-slate-850 dark:text-slate-100">{p.name}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">{p.volume}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] tracking-wider uppercase">Kandungan Utama</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{p.kandungan}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] tracking-wider uppercase">Suhu & Masa Simpan</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{p.suhu}</span>
                      </div>
                    </div>
                    <div className="text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-800/40">
                      <span className="text-slate-400 block font-bold text-[9px] tracking-wider uppercase">Catatan Klinis</span>
                      <span className="text-slate-700 dark:text-slate-300">{p.catatan}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Wide Table */}
              <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full min-w-[650px] text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Produk</th>
                      <th className="px-3 py-2.5">Volume Rata-rata</th>
                      <th className="px-3 py-2.5">Kandungan Utama</th>
                      <th className="px-3 py-2.5">Suhu & Masa Simpan</th>
                      <th className="px-3 py-2.5">Catatan Klinis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-700 dark:text-slate-300">
                    {productSpecs.map((p) => (
                      <tr key={p.name}>
                        <td className="px-3 py-2 font-semibold">{p.name}</td>
                        <td className="px-3 py-2">{p.volume}</td>
                        <td className="px-3 py-2">{p.kandungan}</td>
                        <td className="px-3 py-2">{p.suhu}</td>
                        <td className="px-3 py-2">{p.catatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-100/50 dark:bg-[#2C2C2E]/40 p-3.5 rounded-xl text-xs space-y-2">
              <strong className="text-slate-800 dark:text-slate-200 block">Derivasi Formula Volume PRC (Davies et al. 2007)</strong>
              <p className="text-slate-600 dark:text-slate-400">
                Formula dasar penentuan volume transfusi anak & dewasa adalah:
                <br />
                <code className="font-mono bg-white dark:bg-[#1C1C1E] px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400">Volume (mL) = ΔHb (g/dL) × BB (kg) × 3 / Hct_PRC</code>
              </p>
              
              {/* Mobile View: Stacked factors */}
              <div className="md:hidden space-y-2 mt-2">
                {kFactors.map((f) => (
                  <div key={f.hct} className={`border rounded-xl p-3 ${f.highlight ? 'bg-blue-500/5 border-blue-200 dark:border-blue-800/50' : 'bg-slate-50/50 dark:bg-[#1C1C1E] border-slate-200 dark:border-slate-800'} text-[11px] space-y-1`}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Hematokrit: <strong className="text-slate-800 dark:text-slate-200">{f.hct}</strong></span>
                      <span className={`px-2 py-0.5 rounded font-extrabold text-xs ${f.highlight ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{f.factor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Tipe Sediaan</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Wide Table */}
              <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    <tr>
                      <th className="p-2">Hematokrit Sediaan</th>
                      <th className="p-2">Faktor Pengali k</th>
                      <th className="p-2">Tipe Sediaan Produk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {kFactors.map((f) => (
                      <tr key={f.hct} className={f.highlight ? "bg-blue-50/50 dark:bg-blue-500/5" : ""}>
                        <td className="p-2 font-medium">{f.hct}</td>
                        <td className="p-2 font-extrabold text-blue-600 dark:text-blue-400">{f.factor}</td>
                        <td className="p-2 font-medium">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                *Referensi Utama: Davies P et al. Transfusion 2007;47(2):212–217. doi:10.1111/j.1537-2995.2007.01091.x
              </p>
            </div>
          </div>
        </Accordion>

        {/* Accordion 2: Calcium Gluconate & Citrate Toxicity */}
        <Accordion title="⚠️ Terapi Adjuvan — Kalsium Glukonat & Toksisitas Sitrat">
          <div className="space-y-4">
            
            {/* Mechanism text */}
            <div className="space-y-2 text-xs">
              <strong className="text-slate-800 dark:text-slate-200 block">Mengapa Transfusi Dapat Menyebabkan Hipokalsemia?</strong>
              <p>
                Seluruh produk darah simpan (terutama PRC, WB, dan FFP) menggunakan senyawa <strong>Sodium Sitrat</strong> sebagai zat pengawet antikoagulan. Sitrat bekerja dengan mengikat kalsium ionisasi bebas (iCa²⁺) sehingga menghambat rantai koagulasi di dalam kantong darah.
              </p>
              <p>
                Pada kondisi fisiologis normal, organ hepar akan memetabolisme sitrat menjadi bikarbonat dengan kapasitas rata-rata <strong>1 hingga 1,5 unit kantong darah per jam</strong>. Namun, jika terjadi:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                <li><strong>Transfusi masif:</strong> Laju pemberian cairan &gt; 1 unit per 15 menit atau &gt; 4 unit/jam.</li>
                <li><strong>Hipotermia atau Syok:</strong> Laju perfusi hepar sangat menurun drastis.</li>
                <li><strong>Disfungsi Hepar Berat:</strong> Gangguan metabolisme sitrat secara mendasar.</li>
              </ul>
              <p>
                Sitrat akan terakumulasi di dalam sirkulasi darah pasien, mengikat kalsium plasma secara masif dan menimbulkan <strong>hipokalsemia fungsional akut</strong> yang sangat membahayakan stabilitas kardiovaskular.
              </p>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-xs">
              <strong>Tanda Hipokalsemia Klinis Terjadi:</strong> Pemanjangan interval QTc pada EKG, hipotensi yang tidak responsif vasopressor, bradikardia reflektif, tremor/spasme otot (tetani), hingga kolaps kardiovaskular total.
            </div>

            {/* Dosing and protocol tables */}
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block text-xs mb-1.5">Protokol Dosis Kalsium Glukonat 10%</strong>
              
              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                {caDoses.map((c) => (
                  <div key={c.indication} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-2">
                    <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5 flex justify-between items-start gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{c.indication}</span>
                      <span className="text-[10px] bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 px-2 py-0.5 rounded font-bold whitespace-nowrap">{c.dose}</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Rasional & Rekomendasi</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{c.rationale}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
                <table className="w-full min-w-[500px] text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2">Indikasi Klinis</th>
                      <th className="px-3 py-2">Dosis Ca Glukonat 10%</th>
                      <th className="px-3 py-2">Rasional & Rekomendasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {caDoses.map((c) => (
                      <tr key={c.indication}>
                        <td className="px-3 py-2 font-medium">{c.indication}</td>
                        <td className="px-3 py-2 font-bold text-red-600 dark:text-red-400">{c.dose}</td>
                        <td className="px-3 py-2">{c.rationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-step administration guidance */}
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block text-xs mb-1.5">Aturan Pemberian & Keamanan Klinis</strong>
              
              {/* Mobile View */}
              <div className="md:hidden space-y-2.5">
                {caSteps.map((s) => (
                  <div key={s.step} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block border-b border-slate-200/60 dark:border-slate-800/60 pb-1">{s.step}</span>
                    <p className={`text-[11px] ${s.isWarning ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
                <table className="w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2">Langkah Kerja</th>
                      <th className="px-3 py-2">Metode Kompatibilitas & Risiko</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {caSteps.map((s) => (
                      <tr key={s.step}>
                        <td className="px-3 py-2 font-semibold">{s.step}</td>
                        <td className={`px-3 py-2 ${s.isWarning ? "text-red-600 dark:text-red-400 font-bold" : ""}`}>{s.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison Table: Gluconate vs Chloride */}
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block text-xs mb-1.5">Perbedaan Ca-Glukonat vs Ca-Klorida (CaCl₂)</strong>
              
              {/* Mobile View */}
              <div className="md:hidden space-y-3">
                {caComparison.map((item) => (
                  <div key={item.kriteria} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block border-b border-slate-200/60 dark:border-slate-800/60 pb-1">{item.kriteria}</span>
                    <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Ca Glukonat 10%</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.gluconate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Ca Klorida 10%</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.chloride}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
                <table className="w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-600">
                    <tr>
                      <th className="px-3 py-2">Kriteria</th>
                      <th className="px-3 py-2">Kalsium Glukonat 10%</th>
                      <th className="px-3 py-2">Kalsium Klorida (CaCl₂) 10%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {caComparison.map((item) => (
                      <tr key={item.kriteria}>
                        <td className="px-3 py-2 font-semibold">{item.kriteria}</td>
                        <td className="px-3 py-2 text-emerald-600 dark:text-emerald-400 font-medium">{item.gluconate}</td>
                        <td className="px-3 py-2 text-red-600 dark:text-red-400 font-medium">{item.chloride}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              *Referensi Utama: Rossaint R et al. ESAIC Guidelines. Eur J Anaesthesiol 2023;40(5):343–414 · Inaba K et al. J Trauma Acute Care Surg 2013;75:416 · Marsden M et5 et al. Curr Opin Anaesthesiol 2021;34:208
            </div>
          </div>
        </Accordion>

        {/* Accordion 3: Evidence-based Premedication */}
        <Accordion title="💉 Premedikasi Transfusi — Indikasi & Evidence">
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Praktik memberikan premedikasi rutin berupa antipiretik (Paracetamol) dan antihistamin secara blanket (pukul rata) kepada setiap pasien transfusi <strong>tidak didukung oleh bukti ilmiah yang adekuat (Evidence-Based Medicine)</strong>. Studi klinis acak menunjukkan premedikasi rutin tidak menurunkan risiko reaksi transfusi non-hemolitik febris (FNHTR) atau reaksi alergi ringan secara signifikan, namun justru meningkatkan risiko efek samping pengobatan.
            </p>

            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-xs">
              <strong>Rekomendasi Guideline Internasional (AABB / NICE):</strong> Batasi pemberian premedikasi hanya untuk kelompok pasien dengan indikasi klinis spesifik berikut.
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {premedRules.map((r) => (
                <div key={r.condition} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-2">
                  <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5 flex justify-between items-start gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{r.condition}</span>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-bold whitespace-nowrap">{r.drug}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Dasar Pemikiran Medis</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{r.rationale}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
              <table className="w-full min-w-[500px] text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2.5">Kondisi Klinis Spesifik</th>
                    <th className="px-3 py-2.5">Pilihan Obat & Dosis</th>
                    <th className="px-3 py-2.5">Dasar Pemikiran Medis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {premedRules.map((r) => (
                    <tr key={r.condition}>
                      <td className="px-3 py-2 font-medium">{r.condition}</td>
                      <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">{r.drug}</td>
                      <td className="px-3 py-2">{r.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              *Referensi Utama: AABB Clinical Practice Guidelines 2016 · NICE Guideline NG24 Blood Transfusion 2015 (updated 2023)
            </div>
          </div>
        </Accordion>

        {/* Accordion 4: Infusion Rate & 4-Hour Rule */}
        <Accordion title="⏱️ Kecepatan Infus — Aturan 4 Jam & Rate per Kolf">
          <div className="space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Setiap komponen kantong darah yang keluar dari media penyimpanan dingin (2–6°C) harus <strong>selesai diinfus dalam waktu maksimal 4 jam</strong>. Hal ini krusial untuk mencegah proliferasi bakteri patogen di dalam kantong darah hangat.
            </p>

            <div className="bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-300 p-3 rounded-lg text-xs">
              <strong>Aturan Emas 4 Jam:</strong> Jika setelah 4 jam sejak dikeluarkan dari kulkas darah belum habis diinfuskan, sisa cairan darah harus segera dihentikan, didokumentasikan, dan dibuang secara aman. Jangan mengompromikan keselamatan pasien.
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {infusionRates.map((r) => (
                <div key={r.condition} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-2">
                  <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{r.condition}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Laju Kecepatan</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{r.rate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Durasi Kolf</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{r.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
              <table className="w-full min-w-[500px] text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2.5">Kondisi Pasien</th>
                    <th className="px-3 py-2.5">Laju Kecepatan Infus</th>
                    <th className="px-3 py-2.5">Durasi Estimasi per Kolf PRC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {infusionRates.map((r) => (
                    <tr key={r.condition}>
                      <td className="px-3 py-2 font-medium">{r.condition}</td>
                      <td className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200">{r.rate}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{r.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              *Referensi Utama: WHO Guidelines for Safe Blood Transfusion · BCSH Administration of Blood Components 2012
            </div>
          </div>
        </Accordion>

        {/* Accordion 5: Interval Between Bags & Single-unit Approach */}
        <Accordion title="🔄 Interval Antar Kolf — Evidence vs Praktik">
          <div className="space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-xs">
              <strong>Mitos Medis Lokal:</strong> Tidak ada standar guideline internasional yang mewajibkan jeda waktu 4 s/d 12 jam antar pemberian kolf darah. Kebiasaan menjeda transfusi secara kaku di RS tanpa evaluasi klinis yang jelas berisiko menunda penanganan klinis esensial.
            </div>

            <div className="space-y-2 text-xs">
              <strong className="text-slate-800 dark:text-slate-200 block">Strategi Modern: Single-Unit Reassessment</strong>
              <p>
                Rekomendasi dari NICE, AABB, dan Canadian Blood Services menekankan strategi <strong>Single-Unit Transfusion (Transfusi Satu Unit)</strong> untuk pasien klinis stabil yang tidak mengalami perdarahan aktif:
              </p>
              <ul className="list-decimal pl-5 space-y-1 text-slate-500 dark:text-slate-400">
                <li>Berikan <strong>1 unit kolf darah saja</strong> terlebih dahulu dengan kecepatan yang sesuai.</li>
                <li>Lakukan evaluasi ulang (reassessment) klinis pasien dan status hemodinamik setelah selesai.</li>
                <li>Pemeriksaan kadar Hb serial pasca transfusi dapat dilakukan <strong>15 hingga 60 menit setelah selesai infus</strong> (karena eritrosit langsung berbaur di dalam sirkulasi).</li>
                <li>Hanya lanjutkan unit berikutnya jika pasien masih simtomatik atau kadar Hb masih di bawah ambang batas sasaran.</li>
              </ul>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {intervalRules.map((i) => (
                <div key={i.situation} className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-[#1C1C1E] space-y-2">
                  <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-1.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{i.situation}</span>
                  </div>
                  <div className="text-[11px] space-y-1.5">
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Protokol Penanganan</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{i.protocol}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Tujuan Utama</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{i.goal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1C1C1E]">
              <table className="w-full min-w-[500px] text-xs text-left divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-600">
                  <tr>
                    <th className="px-3 py-2.5">Situasi Klinis</th>
                    <th className="px-3 py-2.5">Protokol Penanganan yang Benar</th>
                    <th className="px-3 py-2.5">Tujuan Utama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {intervalRules.map((i) => (
                    <tr key={i.situation}>
                      <td className="px-3 py-2 font-medium">{i.situation}</td>
                      <td className="px-3 py-2 font-bold text-slate-800 dark:text-slate-200">{i.protocol}</td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{i.goal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-400 italic">
              *Referensi Utama: Carson JL et al. Ann Intern Med 2016;165:519 · Holst LB et al. (TRISS). NEJM 2014;371:1381 · Lieberman L et al. Transfusion 2013;53:790
            </div>
          </div>
        </Accordion>
      </div>

    </div>
  );
}

// Static Reference Datasets for Clean Responsive Rendering
const productSpecs = [
  { name: 'PRC', volume: '±250 mL', kandungan: 'Eritrosit, Hct 55–80%', suhu: '2–6°C (35–42 hari)', catatan: 'Wajib kompatibilitas ABO & Rh' },
  { name: 'Whole Blood (WB)', volume: '±450 mL', kandungan: 'Eritrosit, plasma, faktor koagulasi', suhu: '2–6°C (21–35 hari)', catatan: 'Jarang tersedia di BDRS Indonesia' },
  { name: 'FFP', volume: '±200–250 mL', kandungan: 'Seluruh faktor pembekuan plasma', suhu: '≤ -18°C (12 bulan)', catatan: 'Habiskan dlm 4 jam pasca thaw' },
  { name: 'TC Random Donor', volume: '±50–70 mL', kandungan: 'Trombosit ≥5.5 × 10¹⁰', suhu: '20–24°C dengan agitasi (5 hari)', catatan: '4–6 unit setara 1 dosis dewasa' },
  { name: 'TC Apheresis (SDA)', volume: '±250–300 mL', kandungan: 'Trombosit ≥3.0 × 10¹¹', suhu: '20–24°C dengan agitasi (5 hari)', catatan: 'Setara 4–6 kolf donor acak' },
  { name: 'Cryoprecipitate', volume: '±15–20 mL', kandungan: 'Fibrinogen ≥150 mg, F VIII, vWF', suhu: '≤ -18°C (12 bulan)', catatan: 'Berikan segera pasca thaw' }
];

const kFactors = [
  { hct: '60%', factor: 'k = 5', desc: 'PRC dengan cairan tambahan SAGM (Standar Eropa/AS)', highlight: false },
  { hct: '70–75%', factor: 'k = 4', desc: 'PRC murni tanpa cairan aditif (Umum di BDRS Indonesia) ✓', highlight: true },
  { hct: '100%', factor: 'k = 3', desc: 'Eritrosit murni kering (Secara klinis tidak realistis)', highlight: false }
];

const caDoses = [
  { indication: 'Transfusi Masif Profilaksis', dose: '10 mL (1 g) IV', rationale: 'Berikan rutin setiap selesai transfusi 4 unit PRC/WB' },
  { indication: 'Hipokalsemia Tanpa Gejala', dose: '10–20 mL IV lambat', rationale: 'Jika kadar iCa serum < 1.1 mmol/L' },
  { indication: 'Hipokalsemia Simtomatik Berat', dose: '20–30 mL IV segera', rationale: 'Jika timbul kejang tetani, pemanjangan QTc, atau henti jantung' }
];

const caSteps = [
  { step: 'Pengenceran Cairan', desc: 'Encerkan 10 mL Ca Glukonat 10% dengan NaCl 0.9% 10 mL menjadi total 20 mL.', isWarning: false },
  { step: 'Kecepatan Pemberian', desc: 'Wajib diberikan secara perlahan minimal 3–5 menit. Pemberian bolus cepat berisiko aritmia fatal dan asistole!', isWarning: true },
  { step: 'Jalur Akses Intravena', desc: 'Gunakan jalur infus terpisah dari produk darah. Jangan mencampur obat apa pun di kantong darah.', isWarning: false },
  { step: 'Target Monitoring', desc: 'Pertahankan kalsium ionisasi (iCa²⁺) sirkulasi antara 1.1 s/d 1.3 mmol/L.', isWarning: false }
];

const caComparison = [
  { kriteria: 'Kandungan Ca Elemental', gluconate: '93 mg per 10 mL (Lini Pertama Transfusi)', chloride: '272 mg per 10 mL (3 kali lebih pekat)' },
  { kriteria: 'Keamanan Vena Perifer', gluconate: 'Sangat aman untuk pembuluh vena perifer', chloride: 'Iritatif berat. Harus via Central Venous Catheter (CVC)' },
  { kriteria: 'Penggunaan Darurat', gluconate: 'Transfusi masif rutin di ICU / Kamar Bedah', chloride: 'Hanya pada cardiac arrest dengan hiperkalemia/hipokalsemia' }
];

const premedRules = [
  { condition: 'Risiko Tinggi TACO (CHF, CKD, Overload)', drug: 'Furosemide 10–20 mg IV pelan', rationale: 'Diuresis mencegah kelebihan volume sirkulasi paru akut' },
  { condition: 'Riwayat Reaksi Alergi Ringan Berulang (Urtikaria)', drug: 'Diphenhydramine 25–50 mg IV/IM', rationale: 'Memblokir pengikatan histamin fungsional pasca transfusi' },
  { condition: 'Riwayat Reaksi Alergi Sedang-Berat / Anafilaksis', drug: 'Dexamethasone 4–10 mg IV + Antihistamin', rationale: 'Supresi imunologis mendalam untuk mencegah anafilaksis fatal' }
];

const infusionRates = [
  { condition: '15 Menit Pertama (Seluruh Pasien)', rate: '~1–2 mL/menit (~60 mL/jam)', duration: 'Observasi ketat reaksi anafilaksis akut/hipotensi' },
  { condition: 'Kondisi Stabil / Tanpa Risiko Overload', rate: '2–4 mL/kg/jam', duration: 'Tergantung BB, diselesaikan dalam ±1.5 s/d 2 jam' },
  { condition: 'Risiko Tinggi TACO (Lansia, CHF, Gagal Ginjal)', rate: '1–1.5 mL/kg/jam', duration: 'Diberikan sangat lambat, habiskan dalam ±3 s/d 4 jam' },
  { condition: 'Perdarahan Aktif Hebat / Syok Hemoragik', rate: 'Secepat mungkin sesuai klinis', duration: 'Dapat diberikan kurang dari 15–30 menit via infus bertekanan' }
];

const intervalRules = [
  { situation: 'Pasien ICU Stabil', protocol: 'Transfusi 1 kolf → Tunggu 15 menit → Reassess gejala & Hb → Lanjut jika butuh', goal: 'Mencegah overtransfusi dan paparan imunogenik tidak perlu' },
  { situation: 'Pasien Risiko Overload Paru (TACO)', protocol: 'Transfusi 1 kolf + Furosemide 20 mg di antaranya → evaluasi ketat tanda overload', goal: 'Mengurangi tekanan hidrostatik pembuluh vena paru secara simultan' },
  { situation: 'Perdarahan Masif Berlangsung', protocol: 'Transfusi berturut-turut tanpa jeda dengan rasio berimbang 1:1:1 (PRC:FFP:TC)', goal: 'Mengembalikan hemodinamik sirkulasi darah secepat mungkin' }
];

