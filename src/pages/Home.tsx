import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, Pill, Activity, BookOpen, Droplets, 
  Wind, ListChecks, ChevronRight, Zap, FlaskConical, Scale, HeartPulse, TestTube2, Brain, Baby, BarChart2, BookMarked, User, Plus, X, Star, Linkedin, Clock
} from 'lucide-react';
import { usePatientStore, PatientData } from '../store/usePatientStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useRecentToolsStore } from '../store/useRecentToolsStore';
import { ALL_FAVORITABLE_ITEMS, getFavoritableItemByPath } from '../data/favoritableItems';

function PatientEditorSheet({ onClose }: { onClose: () => void }) {
  const patient = usePatientStore();
  
  const [formData, setFormData] = useState<Partial<PatientData>>({
    nama: patient.nama,
    ageYears: patient.ageYears,
    weightKg: patient.weightKg,
    mrsDate: patient.mrsDate || new Date().toISOString().split('T')[0],
    gender: patient.gender,
  });

  const handleSave = () => {
    patient.setPatientData(formData);
    onClose();
  };

  const handleReset = () => {
    patient.resetPatientData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div 
        className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="bg-[var(--bg-elevated)] w-full rounded-t-[16px] relative z-40 animate-in slide-in-from-bottom-full duration-200 border-t border-[var(--glass-border)] shadow-[var(--shadow-2)] flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-4 border-b border-[var(--separator)]">
          <button onClick={onClose} className="text-[var(--accent)] text-[17px]">Batal</button>
          <h2 className="font-semibold text-[17px] tracking-tight text-[var(--label-primary)]">Data Pasien</h2>
          <button onClick={handleSave} className="font-semibold text-[var(--accent)] text-[17px]">Simpan</button>
        </div>
        <div className="flex flex-col p-4 gap-4 overflow-y-auto pb-10 no-scrollbar">
          
          <div className="ios-list" style={{ margin: 0 }}>
            <div className="ios-row">
              <span className="ios-row-label" style={{ width: 80 }}>Nama</span>
              <input 
                type="text" 
                placeholder="Nama Pasien" 
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-right font-medium text-[var(--label-primary)]" 
              />
            </div>
            <div className="ios-row">
              <span className="ios-row-label" style={{ width: 80 }}>Gender</span>
              <select 
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="flex-1 bg-transparent border-none outline-none text-right font-medium text-[var(--label-primary)] appearance-none" 
              >
                <option value="">Pilih</option>
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          <div className="ios-section" style={{ padding: '0 4px 6px' }}>
            <span className="label">Antropometri & Perawatan</span>
          </div>

          <div className="ios-list" style={{ margin: 0 }}>
            <div className="ios-row">
              <span className="ios-row-label" style={{ width: 120 }}>Usia (Tahun)</span>
              <input 
                type="number" 
                inputMode="decimal"
                placeholder="0" 
                value={formData.ageYears}
                onChange={e => setFormData({ ...formData, ageYears: e.target.value, agePrecise: e.target.value + ' thn' })}
                className="flex-1 bg-transparent border-none outline-none text-right font-medium text-[var(--label-primary)]" 
              />
            </div>
            <div className="ios-row">
              <span className="ios-row-label" style={{ width: 120 }}>Berat (kg)</span>
              <input 
                type="number" 
                inputMode="decimal"
                placeholder="0" 
                value={formData.weightKg}
                onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-right font-medium text-[var(--label-primary)]" 
              />
            </div>
            <div className="ios-row">
              <span className="ios-row-label" style={{ width: 120 }}>Tanggal MRS</span>
              <input 
                type="date" 
                value={formData.mrsDate}
                onChange={e => setFormData({ ...formData, mrsDate: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none text-right font-medium text-[var(--label-primary)] cursor-pointer" 
              />
            </div>
          </div>

          <button onClick={handleReset} className="mt-4 p-3 bg-[var(--bg-tertiary)] border border-[var(--separator)] rounded-[12px] text-[var(--danger)] font-medium">
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const patient = usePatientStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { favorites, toggleFavorite } = useFavoritesStore();
  const recentPaths = useRecentToolsStore(state => state.recentPaths);

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

  const hasPatientData = patient.weightKg || patient.ageYears || patient.heightCm || patient.mrsDate;
  const favoriteItems = ALL_FAVORITABLE_ITEMS.filter(it => favorites.includes(it.path));
  const recentItems = recentPaths.map(p => getFavoritableItemByPath(p)).filter(Boolean).slice(0, 3);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Header Section */}
      <div className="pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-3.5">
          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 dark:text-teal-400 tracking-wide uppercase">
            ⚡ Your Daily Companion in ER & Intensive Care
          </span>
        </div>
        
        <div className="mb-2 leading-tight">
          <span className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            ICU/ER
          </span>
          <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {" "}Helper
          </span>
        </div>
        
        <div className="mb-3">
          <a
            href="https://id.linkedin.com/in/rizqanfahlevvi/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-[#0077b5] dark:text-[#00a0dc] transition-all duration-150 font-bold text-[11px] tracking-wider cursor-pointer"
          >
            <Linkedin className="w-3.5 h-3.5 fill-current" />
            <span>MADE BY RIZQANFAHLEVVI</span>
          </a>
        </div>
        <p className="text-muted-foreground text-[13px] md:text-sm max-w-md">
          Akses cepat kalkulator klinis, skoring kritis, manajemen infus dosis obat, dan referensi literatur berbasis bukti.
        </p>
      </div>

      {/* Patient Summary Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Status Pasien Aktif
          </span>
        </div>
        
        {!hasPatientData ? (
          <Link 
            className="bg-card border border-border/80 w-full flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:border-slate-400 transition-colors block"
            to="/patients"
          >
            <span className="w-10 h-10 rounded-full bg-[var(--fill-secondary)] flex items-center justify-center text-[var(--label-tertiary)] flex-shrink-0 animate-pulse">
              <User size={18} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-[var(--label-primary)]">Data Pasien</p>
              <p className="text-xs text-[var(--label-secondary)] mt-0.5">Belum diisi — ketuk untuk mengelola database pasien</p>
            </div>
            <Plus size={18} className="text-[var(--accent)]" />
          </Link>
        ) : (
          <Link 
            className="bg-card border border-border/80 w-full rounded-2xl shadow-sm hover:border-teal-500/50 transition-all duration-150 block overflow-hidden"
            to="/patients"
          >
            <div className="p-4 flex items-center gap-3 border-b border-[var(--separator)]">
              <span className="w-9 h-9 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                <User size={18} />
              </span>
              <div className="flex-1">
                <p className="font-bold text-sm text-[var(--label-primary)]">{patient.nama || 'Pasien Anonim'}</p>
                <p className="text-xs text-[var(--label-secondary)] mt-0.5">{patient.gender} · {patient.category}</p>
              </div>
              <span className="ios-badge ios-badge--accent text-xs font-black">Aktif</span>
            </div>
            <div className="flex divide-x divide-[var(--separator)] font-mono">
              <div className="flex-1 p-3 text-center md:text-left md:pl-5">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold font-sans tracking-wide">Usia</div>
                <div className="text-sm font-bold text-[var(--label-primary)] mt-1">{patient.agePrecise || (patient.ageYears ? `${patient.ageYears} thn` : '') || '-'}</div>
              </div>
              <div className="flex-1 p-3 text-center md:text-left md:pl-5">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold font-sans tracking-wide">Berat</div>
                <div className="text-sm font-bold text-[var(--label-primary)] mt-1">{patient.weightKg ? patient.weightKg + ' kg' : '-'}</div>
              </div>
              <div className="flex-1 p-3 text-center md:text-left md:pl-5">
                <div className="text-[10px] uppercase text-muted-foreground font-semibold font-sans tracking-wide">Hari Perawatan</div>
                <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                  {patient.mrsDate ? (getHariPerawatan(patient.mrsDate) || "Hari Ke-1") : '-'}
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Pinned / Recent Tools Section */}
      {recentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="ios-section" style={{ padding: 0 }}>
              <span className="label flex items-center gap-1.5 font-bold text-blue-500">
                <Clock className="w-4 h-4 text-blue-500" />
                Terakhir Diakses
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 snap-x">
            {recentItems.map((item, index) => {
              if (!item) return null;
              const Icon = item.icon || Activity;
              return (
                <div 
                  key={item.path + index}
                  onClick={() => navigate(item.path)}
                  className="flex-shrink-0 w-[140px] snap-start bg-card border border-border/80 rounded-xl p-3 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-[12px] text-foreground tracking-tight line-clamp-2">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Favorit Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="ios-section" style={{ padding: 0 }}>
            <span className="label flex items-center gap-1.5 font-bold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Akses Cepat Favorit
            </span>
          </div>
          {favoriteItems.length > 0 && (
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium">
              {favoriteItems.length} Tersemat
            </span>
          )}
        </div>

        {favoriteItems.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-5 text-center space-y-2 bg-muted/10">
            <Star className="w-7 h-7 text-muted-foreground/30 mx-auto" />
            <p className="text-xs font-semibold text-foreground/90">Belum Ada Menu Favorit</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-md mx-auto">
              Sematkan kalkulator, skoring klinis, atau referensi obat yang sering digunakan dengan mengetuk bintang <span className="text-amber-500 font-bold">★</span> di halaman detail atau daftar sub-menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {favoriteItems.map((item) => {
              const Icon = item.icon || Activity;
              return (
                <div 
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group relative bg-card border border-border/80 rounded-xl p-3 shadow-sm hover:border-amber-500/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[95px] cursor-pointer"
                >
                  <div className="absolute top-2.5 right-2.5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.path);
                      }}
                      className="p-1 hover:bg-muted rounded-full transition-colors relative z-10"
                      title="Hapus dari Favorit"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <span className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground/80 tracking-wider uppercase">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-[12px] text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4 Pilar Utama Grid */}
      <div className="space-y-3">
        <div className="ios-section" style={{ padding: '0 4px' }}>
          <span className="label">Pilar Modul Klinis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Kalkulator Medis */}
          <div 
            onClick={() => navigate('/calculator')}
            className="group cursor-pointer p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[175px]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 dark:text-teal-400 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/60 p-1 px-2.5 rounded-full">
                  14 Alat
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-foreground group-hover:text-teal-600 dark:text-teal-400 dark:group-hover:text-teal-400 transition-colors">
                  Kalkulator Medis
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Estimasi eGFR, parameter ventilator awal (ARDSNet), koreksi defisit elektrolit, sliding scale insulin, kebutuhan cairan basal, dan indeks NLR.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">eGFR</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">ARDSNet VT</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Elektrolit</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Insulin</span>
            </div>
          </div>

          {/* Card 2: Skoring Klinis */}
          <div 
            onClick={() => navigate('/scoring')}
            className="group cursor-pointer p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[175px]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/60 p-1 px-2.5 rounded-full">
                  7 Skor Medis
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Skoring Klinis
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Sistem klasifikasi tingkat keparahan penyakit dan stratifikasi risiko mortalitas intensif: APACHE II, SOFA, CAM-ICU (Delirium), RASS, CPIS, dan BFS.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">APACHE II</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">SOFA</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">CAM-ICU</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">RASS</span>
            </div>
          </div>

          {/* Card 3: iObat & Cairan */}
          <div 
            onClick={() => navigate('/drug-reference')}
            className="group cursor-pointer p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:border-indigo-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[175px]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/60 p-1 px-2.5 rounded-full">
                  146 Obat
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Drip Obat & Cairan (iObat)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Infusi syringe pump (vasopressor/sedative), protokol intubasi cepat RSI (induction doses), panduan tipe cairan, dan checker interaksi obat kritis.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Laju Infus</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Intubasi RSI</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Cairan</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Interaksi</span>
            </div>
          </div>

          {/* Card 4: Referensi & Teori */}
          <div 
            onClick={() => navigate('/reference')}
            className="group cursor-pointer p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[175px]"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <BookMarked className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted/60 p-1 px-2.5 rounded-full">
                  54 Literatur
                </span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Referensi & Teori Klinis
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Panduan tatalaksana Sepsis-3, resusitasi syok, pendekatan gagal napas, strategi SAT/SBT pembebasan ventilator, asuhan B1-B6, dan 54+ literatur rujukan.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Sepsis-3</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">Resusitasi Syok</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">SAT & SBT</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-md">B1-B6</span>
            </div>
          </div>
        </div>
      </div>

      {isEditorOpen && <PatientEditorSheet onClose={() => setIsEditorOpen(false)} />}
    </div>
  );
}

