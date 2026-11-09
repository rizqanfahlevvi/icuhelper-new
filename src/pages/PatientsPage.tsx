import React, { useState } from 'react';
import {
  User, Plus, Trash2, CheckCircle2, UserPlus,
  Scale, Search, HeartPulse, X,
  Activity, Stethoscope, Users
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { usePatientStore, Patient } from '../store/usePatientStore';
import { useClinicalStore } from '../store/useClinicalStore';
import { ClinicalDataForm } from '../components/patient/ClinicalDataForm';
import { cleanClinicalRecord, cleanTimestamps, formatDataAge } from '../utils/patientContext';
import { AbbrLegend } from '../components/ui/AbbrLegend';

export default function PatientsPage() {
  const { 
    patients, 
    activePatientId, 
    addPatient, 
    updatePatient, 
    deletePatient, 
    setActivePatient,
  } = usePatientStore();

  const clinicalStore = useClinicalStore();
  const filledClinicalKeys = Object.entries(clinicalStore.data).filter(([, v]) => typeof v === 'string' && v !== '');
  // Demografi (BB/TB/usia/JK) dicerminkan dari data pasien, jadi tidak dihitung sebagai "data sesi".
  const sessionVarCount = filledClinicalKeys.filter(([k]) => !['weight', 'height', 'age', 'gender'].includes(k)).length;
  const stampList = Object.values(clinicalStore.updatedAt).filter((t): t is number => typeof t === 'number');
  const lastClinicalUpdate = stampList.length > 0 ? formatDataAge(Math.max(...stampList)) : '';

  // For search/filter
  const [searchTerm, setSearchTerm] = useState('');
  
  // For dialogs/modal visibility
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLabFormOpen, setIsLabFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  // Pasien baru dari sesi tanpa pasien: bawa data klinis sesi? (default TIDAK — aman)
  const [carrySession, setCarrySession] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nama: '',
    category: 'dewasa' as 'dewasa' | 'geriatri',
    gender: '' as '' | 'L' | 'P',
    ageUnit: 'tahun' as 'tahun' | 'bulan',
    ageInput: '',
    weightKg: '',
    heightCm: '',
    mrsDate: '',
  });

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setCarrySession(false);
    setFormData({
      nama: '',
      category: 'dewasa',
      gender: '', // jangan menebak — dokter memilih sendiri
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
      // Pasien baru selalu mulai dengan data klinis kosong, KECUALI pengguna sengaja
      // membawa data sesi tanpa pasien (tidak pernah dari pasien aktif lain).
      const carry = carrySession && !activePatientId && sessionVarCount > 0;
      const sessionData = carry ? cleanClinicalRecord(clinicalStore.data) : undefined;
      const newId = addPatient({
        ...dataPayload,
        ...(sessionData
          ? { clinicalData: sessionData, clinicalUpdatedAt: cleanTimestamps(clinicalStore.updatedAt, sessionData) }
          : {}),
      });
      // Auto-activate new patient
      setActivePatient(newId);
    }
    
    setIsFormOpen(false);
  };

  // Ganti pasien aktif. Data kerja klinis DIGANTI (bukan digabung) dengan snapshot
  // pasien tujuan oleh store/patientContextSync.ts — tidak ada kebocoran antar pasien.
  const handleSelectActive = (id: string) => {
    setActivePatient(id);
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
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-hidden">
      
      {/* Page Header */}
      <div className="pt-2">
        <PageHeader 
          badgeIcon={Users}
          badgeText="Sistem Multi-Pasien Integral"
          title="Data Pasien"
          description="Kelola daftar rekam medis pasien aktif Anda. Parameter klinis (Lab, ABG, Vital Sign) akan tersinkronisasi otomatis per pasien."
          rightContent={
            <button 
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Pasien Baru
            </button>
          }
        />
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
                {filledClinicalKeys.length > 0
                  ? `${filledClinicalKeys.length} variabel klinis/lab tersimpan otomatis${lastClinicalUpdate ? ` · terakhir diperbarui ${lastClinicalUpdate}` : ''}.`
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
                onClick={() => setActivePatient(null)}
                type="button"
                className="text-xs text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
              >
                Tutup Pasien
              </button>
            </div>
          </div>

        </div>

        {/* Modal Pop-up Rekam Medis (Klinis & Lab) dengan Auto-Save */}
        <>
          {isLabFormOpen && (
            <div className="fixed inset-0 !m-0 flex items-center justify-center p-4 z-50">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200" 
                onClick={() => setIsLabFormOpen(false)} 
              />
              
              {/* Modal Container */}
              <div 
                className="relative bg-card border border-[var(--separator)] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
              >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--separator)] bg-[var(--bg-secondary)]">
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
                <ClinicalDataForm />
                {/* Singkatan pada label variabel (registri src/utils/clinicalVariables.ts) */}
                <AbbrLegend
                  terms={[
                    'TD', 'MAP', 'HR', 'RR', 'SpO2', 'GCS', 'FiO2', 'PEEP', 'EPAP', 'AGD', 'PaCO2', 'PaO2', 'HCO3', 'Hb', 'WBC',
                    'MCV', 'MCH', 'MCHC', 'GDS', 'GDP', 'GD', 'PP-prandial', 'HbA1c', 'LDL', 'HDL', 'SGOT', 'SGPT', 'AST', 'ALT',
                  ]}
                />
                <p className="text-center text-[11px] text-muted-foreground pt-2">
                  Setiap nilai tersimpan otomatis ke pasien ini dan dipakai bersama oleh seluruh kalkulator, skoring, dan modul AGD.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[var(--separator)] bg-[var(--bg-secondary)] flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsLabFormOpen(false)}
                  className="px-5 py-2 text-xs font-extrabold bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-95 space-x-2 rounded-xl cursor-pointer shadow-xs"
                >
                  Selesai & Simpan
                </button>
              </div>

            </div>
          </div>
        )}
      </>
        </>
      ) : (
        <div className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 transition-all border border-[var(--separator)] rounded-2xl p-6 text-center">
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
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm outline-hidden focus:border-[var(--accent)] font-medium text-[var(--label-primary)] shadow-2xs"
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
                      : 'border-[var(--separator)] bg-card'
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

                  <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-[var(--separator)] pt-3 sm:pt-0">
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
        <div className="fixed inset-0 !m-0 z-50 flex flex-col justify-end">
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
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                />
              </div>

              {/* Form Row: Kategori & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pf-category" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Kategori</label>
                  <select
                    id="pf-category"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] outline-hidden"
                  >
                    <option value="dewasa">Dewasa (&lt;65)</option>
                    <option value="geriatri">Geriatri (&ge;65)</option>
                  </select>
                  <span className="text-[11px] text-muted-foreground">Otomatis dari usia; bisa diubah.</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pf-gender" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Jenis Kelamin</label>
                  <select
                    id="pf-gender"
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] outline-hidden"
                  >
                    <option value="">Pilih…</option>
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
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
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] outline-hidden"
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
                    onChange={e => {
                      const v = e.target.value;
                      const years = formData.ageUnit === 'tahun' ? parseFloat(v) : NaN;
                      // Kategori mengikuti usia (≥ 65 th = geriatri); tetap bisa diubah manual.
                      const category = Number.isFinite(years) ? (years >= 65 ? 'geriatri' : 'dewasa') : formData.category;
                      setFormData({ ...formData, ageInput: v, category });
                    }}
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
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
                      className="w-full pl-4 pr-10 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
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
                      className="w-full pl-4 pr-10 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
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
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--separator)] rounded-xl text-sm font-semibold text-[var(--label-primary)] focus:border-[var(--accent)] outline-hidden"
                />
              </div>

              {!editingPatient && !activePatientId && sessionVarCount > 0 && (
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={carrySession}
                    onChange={e => setCarrySession(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-amber-600 shrink-0"
                  />
                  <span className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong className="font-bold block">Bawa {sessionVarCount} data klinis dari sesi tanpa pasien</strong>
                    Centang hanya jika nilai tersebut memang milik pasien ini{lastClinicalUpdate ? ` (terakhir diperbarui ${lastClinicalUpdate})` : ''}. Tanpa centang, pasien baru dimulai dengan data klinis kosong.
                  </span>
                </label>
              )}

            </div>
          </form>
        </div>
      )}

      <AbbrLegend terms={['ICU', 'ABG', 'AGD', 'BB', 'TB', 'MRS']} />

    </div>
  );
}
