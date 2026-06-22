import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Plus, Trash2, CheckCircle2, UserPlus, 
  Calendar, Scale, Ruler, Search, HeartPulse, ChevronRight, Save, RefreshCw, X,
  Activity, Droplet, FileText, Thermometer, Stethoscope, Layers
} from 'lucide-react';
import { usePatientStore, Patient } from '../store/usePatientStore';
import { useClinicalStore } from '../store/useClinicalStore';

export default function PatientsPage() {
  const { 
    patients, 
    activePatientId, 
    addPatient, 
    updatePatient, 
    deletePatient, 
    setActivePatient,
    saveActivePatientClinicalData,
    setPatientData
  } = usePatientStore();

  const clinicalStore = useClinicalStore();

  // For search/filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // Active clinical input tab selection
  const [activeTab, setActiveTab] = useState<'vital' | 'hematology' | 'chemistry' | 'renal_liver' | 'electrolytes'>('vital');
  
  // For dialogs/modal visibility
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLabFormOpen, setIsLabFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nama: '',
    category: 'dewasa' as 'dewasa' | 'geriatri',
    gender: 'L' as '' | 'L' | 'P',
    ageUnit: 'tahun' as 'tahun' | 'bulan',
    ageInput: '',
    weightKg: '',
    heightCm: '',
    mrsDate: '',
  });

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData({
      nama: '',
      category: 'dewasa',
      gender: 'L',
      ageUnit: 'tahun',
      ageInput: '',
      weightKg: '',
      heightCm: '',
      mrsDate: new Date().toISOString().split('T')[0], // Default to today's date for ease of entry!
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Patient) => {
    setEditingPatient(p);
    setFormData({
      nama: p.nama,
      category: p.category,
      gender: p.gender,
      ageUnit: p.ageUnit === 'tgl-lahir' ? 'tahun' : p.ageUnit as any,
      ageInput: p.ageUnit === 'bulan' ? p.ageMonths : p.ageYears,
      weightKg: p.weightKg,
      heightCm: p.heightCm,
      mrsDate: p.mrsDate || '',
    });
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;

    const ageYearsVal = formData.ageUnit === 'tahun' ? formData.ageInput : '';
    const ageMonthsVal = formData.ageUnit === 'bulan' ? formData.ageInput : '';
    const agePreciseVal = formData.ageUnit === 'tahun' 
      ? `${formData.ageInput} tahun` 
      : `${formData.ageInput} bulan`;

    const dataPayload = {
      nama: formData.nama,
      category: formData.category,
      gender: formData.gender,
      ageUnit: formData.ageUnit,
      ageInput: formData.ageInput,
      ageYears: ageYearsVal,
      ageMonths: ageMonthsVal,
      agePrecise: agePreciseVal,
      weightKg: formData.weightKg,
      heightCm: formData.heightCm,
      mrsDate: formData.mrsDate,
    };

    if (editingPatient) {
      updatePatient(editingPatient.id, dataPayload);
    } else {
      const newId = addPatient(dataPayload);
      // Auto-activate new patient
      setActivePatient(newId);
    }
    
    setIsFormOpen(false);
  };

  // Switch Active Patient
  const handleSelectActive = (id: string) => {
    setActivePatient(id);
    const targetPatient = patients.find(p => p.id === id);
    if (targetPatient && targetPatient.clinicalData) {
      // Auto-load their saved clinical variables to useClinicalStore
      clinicalStore.setFields(targetPatient.clinicalData);
    } else {
      // Clear current active store parameters when loading a patient with no parameters
      clinicalStore.clearStore();
    }
  };

  // Save current active parameters in useClinicalStore back into patient record
  const handleSaveActiveClinicalData = () => {
    if (!activePatientId) return;
    const cleanClinicalData: Record<string, string> = {};
    
    // Filter out empty options to keep store footprint small
    Object.entries(clinicalStore.data).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        cleanClinicalData[key] = val;
      }
    });

    saveActivePatientClinicalData(cleanClinicalData);
  };

  // Helper to dynamically update a clinical value with auto-save
  const updateClinicalField = (key: keyof typeof clinicalStore.data, value: string) => {
    clinicalStore.setField(key, value);
    if (activePatientId) {
      const currentClinicalData = patients.find(p => p.id === activePatientId)?.clinicalData || {};
      const updatedData = {
        ...currentClinicalData,
        [key]: value,
      };
      
      // Auto-save this updated key-value to patient list
      saveActivePatientClinicalData(updatedData);
    }
  };

  // Live calculation of MAP when systolic or diastolic changes
  const handleVitalChange = (key: 'systolic' | 'diastolic', val: string) => {
    updateClinicalField(key, val);
    const updatedSystolic = key === 'systolic' ? val : (clinicalStore.data.systolic || '');
    const updatedDiastolic = key === 'diastolic' ? val : (clinicalStore.data.diastolic || '');
    
    if (updatedSystolic && updatedDiastolic) {
      const s = parseFloat(updatedSystolic);
      const d = parseFloat(updatedDiastolic);
      if (!isNaN(s) && !isNaN(d)) {
        const calculatedMap = Math.round(d + (s - d) / 3);
        updateClinicalField('map', calculatedMap.toString());
      }
    }
  };

  // Filter list
  const filteredPatients = patients.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activePatient = patients.find(p => p.id === activePatientId);

  const getHariPerawatan = (mrsDateString?: string) => {
    if (!mrsDateString) return null;
    const mrsDate = new Date(mrsDateString);
    mrsDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - mrsDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(diffDays)) return null;
    return `Hari Ke-${diffDays}`;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-3.5">
          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 tracking-wide uppercase">
            👥 SISTEM MULTI-PASIEN INTEGRAL
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Data Pasien</h1>
            <p className="text-muted-foreground text-[13px] md:text-sm mt-1 max-w-lg">
              Kelola daftar rekam medis pasien aktif Anda. Parameter klinis (Lab, ABG, Vital Sign) akan tersinkronisasi otomatis per pasien.
            </p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Pasien Baru
          </button>
        </div>
      </div>

      {/* active check */}
      {activePatient ? (
        <>
          <div className="bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8" />
            
            {/* Top Row: Pasien Aktif & ID */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
                Pasien Aktif
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                ID: #{activePatient.id.substring(0, 6)}
              </span>
            </div>
            
            {/* Middle Row: Circular Icon & Name / Gender / Age */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex-shrink-0 animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--label-primary)] flex flex-wrap items-baseline gap-1.5 min-w-0">
                <span className="font-extrabold truncate">{activePatient.nama}</span>
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  / {activePatient.agePrecise} ({activePatient.gender || '-'})
                </span>
              </h2>
            </div>
            
            {/* Bottom Row: Specs Badges (Dewasa, BB, Hari Perawatan) starting from left margin */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              {/* Kategori */}
              <span className="capitalize bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-flex items-center gap-1.5 shadow-xs">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
                {activePatient.category}
              </span>

              {/* BB */}
              <span className="bg-background/45 border border-[var(--glass-border)] text-[var(--label-secondary)] px-3 py-1.5 rounded-xl font-bold inline-flex items-center gap-1.5 shadow-xs">
                <Scale className="w-3.5 h-3.5 text-emerald-500" />
                BB: <strong className="font-extrabold text-[var(--label-primary)]">{activePatient.weightKg ? `${activePatient.weightKg} kg` : '-'}</strong>
              </span>

              {/* Hari Perawatan */}
              <span className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs">
                <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="font-extrabold">
                  {activePatient.mrsDate ? (getHariPerawatan(activePatient.mrsDate) || "Hari Ke-1") : 'Hari Ke-'}
                </span>
                {activePatient.mrsDate && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400/80 font-normal">
                    (MRS: {new Date(activePatient.mrsDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
                  </span>
                )}
              </span>
            </div>

          {/* Saved Patient Parameters Check */}
          <div className="mt-4 border-t border-[var(--glass-border)] pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[var(--bg-tertiary)]/70 -mx-5 -mb-5 px-5 py-4">
            <div className="text-xs">
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-0.5">Memori Klinis & Lab</span>
              <p className="text-[11px] text-muted-foreground">
                {Object.keys(clinicalStore.data).filter(k => clinicalStore.data[k as keyof typeof clinicalStore.data]).length > 0 
                  ? `${Object.keys(clinicalStore.data).filter(k => clinicalStore.data[k as keyof typeof clinicalStore.data]).length} variabel klinis/lab tersimpan otomatis.`
                  : 'Belum ada data klinis/lab tersimpan. Klik Lengkapi Data Pasien untuk mengisi.'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLabFormOpen(true)}
                type="button"
                className="flex items-center gap-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Stethoscope className="w-3.5 h-3.5" /> Lengkapi Data Pasien
              </button>
              <button
                onClick={() => {
                  setActivePatient(null);
                  clinicalStore.clearStore();
                }}
                type="button"
                className="text-xs text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              >
                Tutup Pasien
              </button>
            </div>
          </div>

        </div>

        {/* Modal Pop-up Rekam Medis (Klinis & Lab) dengan Auto-Save */}
        <AnimatePresence>
          {isLabFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/65 backdrop-blur-xs" 
                onClick={() => setIsLabFormOpen(false)} 
              />
              
              {/* Modal Container */}
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative bg-card border border-[#c2c6d4] dark:border-[#3a3d44] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col z-10"
              >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#c2c6d4]/40 dark:border-[#3a3d44]/40 bg-[var(--bg-secondary)]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[var(--label-primary)]">Lengkapi Rekam Medis Pasien</h3>
                    <p className="text-xs text-muted-foreground">Pasien: <span className="font-bold text-teal-600 dark:text-teal-400">{activePatient.nama}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full border border-teal-500/20">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Auto-Save Aktif
                  </div>
                  <button
                    onClick={() => setIsLabFormOpen(false)}
                    type="button"
                    className="p-1.5 text-muted-foreground hover:bg-muted hover:text-[var(--label-primary)] rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
                
                {/* Diagnosis Input */}
                <div className="flex flex-col gap-1.5 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/[0.02]">
                  <label className="text-[11px] font-bold text-teal-650 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Diagnosis Utama / Diagnosa Medis
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sepsis berat s/d pneumonia, ARDS derajat sedang..."
                    value={clinicalStore.data.diagnosis || ''}
                    onChange={(e) => updateClinicalField('diagnosis', e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                  />
                </div>

                {/* Tab Selector */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-[#c2c6d4]/30 dark:border-[#3a3d44]/30 -mx-1 px-1 no-scrollbar">
                  <button
                    onClick={() => setActiveTab('vital')}
                    type="button"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'vital'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" /> Tanda Vital
                  </button>
                  <button
                    onClick={() => setActiveTab('hematology')}
                    type="button"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'hematology'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <Droplet className="w-3.5 h-3.5" /> Hematologi Lengkap
                  </button>
                  <button
                    onClick={() => setActiveTab('chemistry')}
                    type="button"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'chemistry'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Kimia Klinik
                  </button>
                  <button
                    onClick={() => setActiveTab('renal_liver')}
                    type="button"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'renal_liver'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <HeartPulse className="w-3.5 h-3.5" /> Ginjal & Hati
                  </button>
                  <button
                    onClick={() => setActiveTab('electrolytes')}
                    type="button"
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === 'electrolytes'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-xs'
                        : 'bg-muted hover:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    <Droplet className="w-3.5 h-3.5" /> Elektrolit
                  </button>
                </div>

                {/* Grid fields layout depending on active tab */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  
                  {/* TAB: VITAL */}
                  {activeTab === 'vital' && (
                    <>
                      {/* TDS / Sistolik */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Tensi Sistolik (TDS)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.systolic || ''}
                            onChange={(e) => handleVitalChange('systolic', e.target.value)}
                            placeholder="Contoh: 120"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mmHg</span>
                        </div>
                      </div>

                      {/* TDD / Diastolik */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Tensi Diastolik (TDD)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.diastolic || ''}
                            onChange={(e) => handleVitalChange('diastolic', e.target.value)}
                            placeholder="Contoh: 80"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mmHg</span>
                        </div>
                      </div>

                      {/* MAP */}
                      <div className="flex flex-col gap-1 relative">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                          <span>Mean Arterial Pressure (MAP)</span>
                          <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1 py-0.5 rounded uppercase leading-none font-extrabold scale-95 origin-right">Auto</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.map || ''}
                            onChange={(e) => updateClinicalField('map', e.target.value)}
                            placeholder="Contoh: 93"
                            className="w-full pl-4 pr-14 py-2 bg-teal-500/[0.02] border border-teal-500/20 rounded-xl text-sm font-bold text-teal-600 dark:text-teal-400 focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-teal-600 dark:text-teal-400 font-semibold">mmHg</span>
                        </div>
                      </div>

                      {/* HR / Laju Nadi */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Laju Nadi (HR)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.hr || ''}
                            onChange={(e) => updateClinicalField('hr', e.target.value)}
                            placeholder="Contoh: 85"
                            className="w-full pl-4 pr-16 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">x/menit</span>
                        </div>
                      </div>

                      {/* RR / Laju Nafas */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Laju Nafas (RR)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.rr || ''}
                            onChange={(e) => updateClinicalField('rr', e.target.value)}
                            placeholder="Contoh: 18"
                            className="w-full pl-4 pr-16 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">x/menit</span>
                        </div>
                      </div>

                      {/* Suhu Tubuh */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Suhu Tubuh / Temp</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.temp || ''}
                            onChange={(e) => updateClinicalField('temp', e.target.value)}
                            placeholder="Contoh: 36.5"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">°C</span>
                        </div>
                      </div>

                      {/* FiO2 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Fraksi Oksigen (FiO2)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.fio2 || ''}
                            onChange={(e) => updateClinicalField('fio2', e.target.value)}
                            placeholder="Contoh: 21"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">%</span>
                        </div>
                      </div>

                      {/* GCS */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Glasgow Coma Scale (GCS)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            min="3"
                            max="15"
                            value={clinicalStore.data.gcs || ''}
                            onChange={(e) => updateClinicalField('gcs', e.target.value)}
                            placeholder="Range: 3 - 15"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">Skor</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB: HEMATOLOGY */}
                  {activeTab === 'hematology' && (
                    <>
                      {/* Hb */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Hemoglobin (Hb)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.hb || ''}
                            onChange={(e) => updateClinicalField('hb', e.target.value)}
                            placeholder="Contoh: 14.2"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">g/dL</span>
                        </div>
                      </div>

                      {/* WBC / Leukosit */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Leukosit (WBC)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.leukosit || ''}
                            onChange={(e) => updateClinicalField('leukosit', e.target.value)}
                            placeholder="Contoh: 9.8"
                            className="w-full pl-4 pr-18 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">10³/µL</span>
                        </div>
                      </div>

                      {/* PLT / Trombosit */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Trombosit (Platelet)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.trombosit || ''}
                            onChange={(e) => updateClinicalField('trombosit', e.target.value)}
                            placeholder="Contoh: 250"
                            className="w-full pl-4 pr-18 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">10³/µL</span>
                        </div>
                      </div>

                      {/* Hematokrit */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Hematokrit</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.hematokrit || ''}
                            onChange={(e) => updateClinicalField('hematokrit', e.target.value)}
                            placeholder="Contoh: 42.5"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">%</span>
                        </div>
                      </div>

                      {/* MCV */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">MCV (Mean Corpuscular Vol.)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.mcv || ''}
                            onChange={(e) => updateClinicalField('mcv', e.target.value)}
                            placeholder="Contoh: 88"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">fL</span>
                        </div>
                      </div>

                      {/* MCH */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">MCH (Mean Corpuscular Hb)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.mch || ''}
                            onChange={(e) => updateClinicalField('mch', e.target.value)}
                            placeholder="Contoh: 30"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">pg</span>
                        </div>
                      </div>

                      {/* MCHC */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">MCHC</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.mchc || ''}
                            onChange={(e) => updateClinicalField('mchc', e.target.value)}
                            placeholder="Contoh: 33.2"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">g/dL</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB: CHEMISTRY */}
                  {activeTab === 'chemistry' && (
                    <>
                      {/* Albumin */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Albumin</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.albumin || ''}
                            onChange={(e) => updateClinicalField('albumin', e.target.value)}
                            placeholder="Contoh: 3.5"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">g/dL</span>
                        </div>
                      </div>

                      {/* Asam Urat */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Asam Urat</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.acidUric || ''}
                            onChange={(e) => updateClinicalField('acidUric', e.target.value)}
                            placeholder="Contoh: 6.2"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* Cholesterol Total */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Cholesterol Total</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.cholesterol || ''}
                            onChange={(e) => updateClinicalField('cholesterol', e.target.value)}
                            placeholder="Contoh: 185"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* LDL */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">LDL Cholesterol</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.ldl || ''}
                            onChange={(e) => updateClinicalField('ldl', e.target.value)}
                            placeholder="Contoh: 105"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* HDL */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">HDL Cholesterol</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.hdl || ''}
                            onChange={(e) => updateClinicalField('hdl', e.target.value)}
                            placeholder="Contoh: 45"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* Trigliserida */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Trigliserida</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.trigliserida || ''}
                            onChange={(e) => updateClinicalField('trigliserida', e.target.value)}
                            placeholder="Contoh: 140"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* GDS */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gula Darah Sewaktu (GDS)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.gds || ''}
                            onChange={(e) => updateClinicalField('gds', e.target.value)}
                            placeholder="Contoh: 145"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* GDP */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gula Darah Puasa (GDP)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.gdp || ''}
                            onChange={(e) => updateClinicalField('gdp', e.target.value)}
                            placeholder="Contoh: 95"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* GD2PP */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">GD 2 Jam PP (GD2PP)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.gd2pp || ''}
                            onChange={(e) => updateClinicalField('gd2pp', e.target.value)}
                            placeholder="Contoh: 135"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* HbA1C */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">HbA1C</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.hba1c || ''}
                            onChange={(e) => updateClinicalField('hba1c', e.target.value)}
                            placeholder="Contoh: 5.8"
                            className="w-full pl-4 pr-10 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">%</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB: RENAL & LIVER */}
                  {activeTab === 'renal_liver' && (
                    <>
                      {/* Ureum */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Ureum</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.ureum || ''}
                            onChange={(e) => updateClinicalField('ureum', e.target.value)}
                            placeholder="Contoh: 30"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* Creatinine */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Kreatinin</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.creatinine || ''}
                            onChange={(e) => updateClinicalField('creatinine', e.target.value)}
                            placeholder="Contoh: 0.9"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* SGOT / AST */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SGOT (AST)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.sgot || ''}
                            onChange={(e) => updateClinicalField('sgot', e.target.value)}
                            placeholder="Contoh: 28"
                            className="w-full pl-4 pr-12 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">U/L</span>
                        </div>
                      </div>

                      {/* SGPT / ALT */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SGPT (ALT)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            value={clinicalStore.data.sgpt || ''}
                            onChange={(e) => updateClinicalField('sgpt', e.target.value)}
                            placeholder="Contoh: 32"
                            className="w-full pl-4 pr-12 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">U/L</span>
                        </div>
                      </div>

                      {/* Bilirubin Total */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Bilirubin Total</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.bilirubinTotal || ''}
                            onChange={(e) => updateClinicalField('bilirubinTotal', e.target.value)}
                            placeholder="Contoh: 0.8"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* Bilirubin Direk */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Bilirubin Direk</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.bilirubinDirek || ''}
                            onChange={(e) => updateClinicalField('bilirubinDirek', e.target.value)}
                            placeholder="Contoh: 0.3"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* Bilirubin Indirek */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Bilirubin Indirek</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.bilirubinIndirek || ''}
                            onChange={(e) => updateClinicalField('bilirubinIndirek', e.target.value)}
                            placeholder="Contoh: 0.5"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TAB: ELECTROLYTES */}
                  {activeTab === 'electrolytes' && (
                    <>
                      {/* Natrium */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Natrium (Na)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.na || ''}
                            onChange={(e) => updateClinicalField('na', e.target.value)}
                            placeholder="Contoh: 140"
                            className="w-full pl-4 pr-16 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mEq/L</span>
                        </div>
                      </div>

                      {/* Kalium */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Kalium (K)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.k || ''}
                            onChange={(e) => updateClinicalField('k', e.target.value)}
                            placeholder="Contoh: 4.0"
                            className="w-full pl-4 pr-16 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mEq/L</span>
                        </div>
                      </div>

                      {/* Kalsium */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Kalsium (Ca)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.ca || ''}
                            onChange={(e) => updateClinicalField('ca', e.target.value)}
                            placeholder="Contoh: 9.5"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>

                      {/* Klorida */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Klorida (Cl)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.cl || ''}
                            onChange={(e) => updateClinicalField('cl', e.target.value)}
                            placeholder="Contoh: 102"
                            className="w-full pl-4 pr-16 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mEq/L</span>
                        </div>
                      </div>

                      {/* Magnesium */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Magnesium (Mg)</label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            value={clinicalStore.data.mg || ''}
                            onChange={(e) => updateClinicalField('mg', e.target.value)}
                            placeholder="Contoh: 2.0"
                            className="w-full pl-4 pr-14 py-2 bg-background border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-teal-500 outline-hidden"
                          />
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[11px] text-muted-foreground font-semibold">mg/dL</span>
                        </div>
                      </div>
                    </>
                  )}

                </div>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-muted-foreground">
                    *Tiap nilai di atas tersimpan otomatis ke database pasien dan disinkronisasikan ke seluruh alat hitung medis.
                  </p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#c2c6d4]/40 dark:border-[#3a3d44]/40 bg-[var(--bg-secondary)] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsLabFormOpen(false)}
                  className="px-5 py-2 text-xs font-extrabold bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 space-x-2 rounded-xl cursor-pointer shadow-xs"
                >
                  Selesai & Simpan
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      ) : (
        <div className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 transition-all border border-[#c2c6d4] dark:border-[#3a3d44] rounded-2xl p-6 text-center">
          <User className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <h3 className="font-bold text-[var(--label-primary)]">Belum Ada Pasien Aktif</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Gunakan pasien yang sudah tersimpan di bawah atau tambahkan pasien baru untuk mengaktifkan sinkronisasi otomatis.
          </p>
          <button 
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" /> Pasien Baru
          </button>
        </div>
      )}

      {/* Patient Database Section */}
      <div className="space-y-3">
        <div className="ios-section" style={{ padding: '0 4px' }}>
          <span className="label">Database Pasien ({patients.length})</span>
        </div>

        {/* Search controls */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground/60" />
          </div>
          <input
            type="text"
            placeholder="Cari pasien berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm outline-hidden focus:border-[var(--accent)] font-medium text-[var(--label-primary)] shadow-2xs"
          />
        </div>

        {/* Database List */}
        {filteredPatients.length === 0 ? (
          <div className="py-12 bg-card border rounded-2xl text-center text-muted-foreground">
            <span className="text-sm block font-medium">Tidak ada pasien ditemukan</span>
            <span className="text-xs mt-0.5 block">Silakan tambah pasien untuk memulai rekam medis.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPatients.map((p) => {
              const isActive = p.id === activePatientId;
              const savedMetricCount = p.clinicalData ? Object.keys(p.clinicalData).length : 0;
              
              return (
                <div 
                  key={p.id}
                  className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-[var(--fill-secondary)]/15 ${
                    isActive 
                      ? 'border-emerald-500/50 bg-emerald-500/5 shadow-2xs' 
                      : 'border-[#c2c6d4] dark:border-[#3a3d44] bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl ${isActive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'} flex-shrink-0`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[16px] text-[var(--label-primary)]">{p.nama}</span>
                        {isActive && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 uppercase tracking-widest leading-none">
                            Aktif
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground capitalize bg-[var(--fill-secondary)] px-2 py-0.5 rounded-md font-medium">
                          {p.category}
                        </span>
                      </div>
                      
                      {/* Sub text listing basic information */}
                      <div className="text-xs text-muted-foreground mt-1.5 flex flex-wrap gap-x-3 gap-y-1 items-center">
                        <span>L/P: <strong className="font-semibold text-[var(--label-primary)]">{p.gender || '-'}</strong></span>
                        <span>•</span>
                        <span>Usia: <strong className="font-semibold text-[var(--label-primary)]">{p.agePrecise}</strong></span>
                        <span>•</span>
                        <span>BB: <strong className="font-semibold text-[var(--label-primary)]">{p.weightKg ? `${p.weightKg} kg` : '-'}</strong></span>
                        <span>•</span>
                        <span>TB: <strong className="font-semibold text-[var(--label-primary)]">{p.heightCm ? `${p.heightCm} cm` : '-'}</strong></span>
                        {p.mrsDate && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">
                              Treating: <strong className="font-bold">{getHariPerawatan(p.mrsDate) || "1"}</strong>
                            </span>
                          </>
                        )}
                      </div>

                      {savedMetricCount > 0 && (
                        <div className="text-[10px] mt-2 text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 bg-teal-500/5 border border-teal-500/10 px-2 py-0.5 rounded w-max">
                          <CheckCircle2 className="w-3 h-3" /> Memiliki {savedMetricCount} Parameter Tersimpan
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-[#c2c6d4]/40 pt-3 sm:pt-0">
                    {!isActive && (
                      <button
                        onClick={() => handleSelectActive(p.id)}
                        className="text-xs font-bold border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 px-3 py-2 rounded-xl transition-colors active:scale-95 cursor-pointer"
                      >
                        Aktifkan
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="text-xs font-semibold bg-muted hover:bg-muted/80 text-[var(--label-primary)] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus pasien ${p.nama}?`)) {
                          deletePatient(p.id);
                        }
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-Up Form Modal Sheet */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm transition-opacity" 
            onClick={() => setIsFormOpen(false)} 
          />
          <form 
            onSubmit={handleSave}
            className="bg-[var(--bg-elevated)] w-full rounded-t-[16px] relative z-40 animate-in slide-in-from-bottom-full duration-200 border-t border-[var(--glass-border)] shadow-[var(--shadow-2)] flex flex-col max-h-[85vh]"
          >
            <div className="flex justify-between items-center p-4 border-b border-[var(--separator)]">
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--danger)] text-[16px] font-medium">Batal</button>
              <h2 className="font-bold text-[17px] tracking-tight text-[var(--label-primary)]">
                {editingPatient ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
              </h2>
              <button type="submit" className="font-bold text-[var(--accent)] text-[16px]">Simpan</button>
            </div>
            
            <div className="flex flex-col p-5 gap-5 overflow-y-auto pb-12 no-scrollbar">
              
              {/* Form Row: Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nama Pasien</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap / Inisial Pasien"
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                />
              </div>

              {/* Form Row: Kategori & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kategori ICU</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] outline-hidden"
                  >
                    <option value="dewasa">Dewasa (&lt; 65 Thn)</option>
                    <option value="geriatri">Geriatri (&ge; 65 Thn)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] outline-hidden"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                    <option value="">Tidak Ditentukan</option>
                  </select>
                </div>
              </div>

              {/* Form Row: Usia */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Metode Input Usia</label>
                  <select
                    value={formData.ageUnit}
                    onChange={e => setFormData({ ...formData, ageUnit: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] outline-hidden"
                  >
                    <option value="tahun">Tahun</option>
                    <option value="bulan">Bulan</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Nilai Usia ({formData.ageUnit})
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    required
                    placeholder="0"
                    value={formData.ageInput}
                    onChange={e => setFormData({ ...formData, ageInput: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                  />
                </div>
              </div>

              {/* Antropometri */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Berat Badan (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="0"
                      value={formData.weightKg}
                      onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-muted-foreground">kg</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tinggi Badan (cm)</label>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="any"
                      placeholder="0"
                      value={formData.heightCm}
                      onChange={e => setFormData({ ...formData, heightCm: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                    />
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-muted-foreground">cm</span>
                  </div>
                </div>
              </div>

              {/* Admission Date (MRS) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tanggal Masuk Rumah Sakit (MRS)</label>
                <input
                  type="date"
                  required
                  value={formData.mrsDate}
                  onChange={e => setFormData({ ...formData, mrsDate: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[#c2c6d4] dark:border-[#3a3d44] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                />
              </div>

            </div>
          </form>
        </div>
      )}

    </div>
  );
}
