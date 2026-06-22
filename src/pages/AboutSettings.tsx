import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Check, 
  Sparkles, 
  Moon, 
  Sun, 
  RotateCw, 
  Cpu, 
  User, 
  Heart, 
  MessageSquare, 
  Coffee, 
  TrendingUp, 
  ChevronDown, 
  ShieldAlert, 
  Lightbulb,
  ExternalLink,
  Volume2,
  VolumeX,
  Phone,
  Settings,
  Info,
  Linkedin
} from 'lucide-react';
import { useSettingsStore, FontFamily, FontWeight, ThemeMode } from '../store/settingsStore';
import { getStorageEstimate, refreshCacheAndReload, performHardReset, StorageEstimateInfo } from '../utils/cacheUtils';

export default function AboutSettings() {
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>('settings');
  const [estimate, setEstimate] = useState<StorageEstimateInfo>({ used: '0 Bytes', quota: '0 Bytes', percentage: 0 });
  const [isOpenChangelog, setIsOpenChangelog] = useState<{ [key: string]: boolean }>({ v2: true, v1: false });

  // Get Store State
  const {
    fontFamily,
    fontScale,
    fontWeight,
    themeMode,
    bwMode,
    soundEnabled,
    vibrationEnabled,
    setFontFamily,
    setFontScale,
    setFontWeight,
    setThemeMode,
    setBwMode,
    setSoundEnabled,
    setVibrationEnabled,
    resetSettings
  } = useSettingsStore();

  useEffect(() => {
    getStorageEstimate().then(setEstimate);
  }, []);

  const fontOptions: { id: FontFamily; label: string; sub: string }[] = [
    { id: 'lexend', label: 'Lexend (Default)', sub: 'Clinically optimized spacing' },
    { id: 'inter', label: 'Inter', sub: 'Clean general-purpose sans' },
    { id: 'roboto', label: 'Roboto', sub: 'Familiar UI typeface' },
    { id: 'jetbrains', label: 'JetBrains Mono', sub: 'High-contrast numbers 12.5mg' },
    { id: 'system', label: 'System UI', sub: 'Default operating system layout' },
  ];

  const handleRefreshCache = () => {
    if (vibrationEnabled && navigator.vibrate) navigator.vibrate(100);
    refreshCacheAndReload();
  };

  const handleResetAllData = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua pengaturan dan mengembalikan aplikasi ke kondisi awal?')) {
      resetSettings();
      performHardReset();
    }
  };

  return (
    <div className="ios-screen min-h-screen pb-12">
      {/* Top Header */}
      <div className="pt-6 px-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Pengaturan & Info
          </h1>
        </div>

        {/* Tab Switcher - Segmented Control */}
        <div className="bg-muted p-1 rounded-xl flex border border-border mb-6">
          <button
            onClick={() => {
              setActiveTab('settings');
              if (vibrationEnabled && navigator.vibrate) navigator.vibrate(30);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'settings' 
                ? 'bg-card text-card-foreground shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-4 h-4" />
            Setting App
          </button>
          <button
            onClick={() => {
              setActiveTab('about');
              if (vibrationEnabled && navigator.vibrate) navigator.vibrate(30);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'about' 
                ? 'bg-card text-card-foreground shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Info className="w-4 h-4" />
            About App
          </button>
        </div>

        {/* TAB 1: SETTING APP */}
        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Jenis Font */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground pl-3">
                  PENGATURAN TAMPILAN
                </h3>
                <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border overflow-hidden p-1">
                  <div className="p-4 bg-muted/20 border-b border-border">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" />
                      Jenis Font (Readability)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pilih tipografi yang paling nyaman untuk dibaca dalam kondisi klinis berat atau pencahayaan malam ICU.
                    </p>
                  </div>
                  {fontOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFontFamily(opt.id)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/30 transition-all duration-150 group"
                    >
                      <div>
                        <p className={`text-sm ${fontFamily === opt.id ? 'font-bold text-primary' : 'font-medium text-foreground'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{opt.sub}</p>
                      </div>
                      {fontFamily === opt.id && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-primary">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ukuran Font */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center justify-between">
                    <span>Ukuran Font</span>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold">
                      {Math.round(fontScale * 100)}%
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sesuaikan skala huruf untuk memperjelas angka dosis dan parameter klinis di layar Anda.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-semibold">A</span>
                  <input
                    type="range"
                    min="0.80"
                    max="1.25"
                    step="0.05"
                    value={fontScale}
                    onChange={(e) => setFontScale(parseFloat(e.target.value))}
                    className="flex-1 accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg text-foreground font-bold">A</span>
                </div>

                {/* PREVIEW CONTAINER */}
                <div className="bg-muted/40 rounded-xl p-3 border border-border/80 relative overflow-hidden">
                  <div className="absolute top-0 right-0 py-0.5 px-1.5 bg-muted-foreground/10 text-[9px] uppercase tracking-wider font-bold text-muted-foreground border-b border-l border-border rounded-bl-lg">
                    PREVIEW TAMPILAN SEBELUM DISIMPAN
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5 mt-1.5">
                    UKURAN & KETEBALAN TEKS
                  </p>
                  <p className="text-sm text-foreground font-medium leading-relaxed" style={{ fontSize: `calc(13.5px * ${fontScale})` }}>
                    Dosis: <strong className="text-primary font-bold">1.25 mL</strong> diberikan secara bolus IV lambat dalam 5 menit.
                  </p>
                </div>
              </div>

              {/* Ketebalan Font */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center justify-between">
                    <span>Ketebalan Font</span>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold">
                      {fontWeight === 0 
                        ? 'Normal (Default)' 
                        : fontWeight < 0 
                          ? `${fontWeight <= -75 ? 'Sangat Tipis' : 'Tipis'} (${fontWeight})` 
                          : `${fontWeight >= 100 ? 'Sangat Tebal' : fontWeight >= 50 ? 'Tebal' : 'Medium'} (+${fontWeight})`
                      }
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sesuaikan ketebalan huruf (font weight offset) untuk mengoptimalkan kejelasan teks dan dosis darurat bedside.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-light">Sangat Tipis (-100)</span>
                  <input
                    type="range"
                    min="-100"
                    max="150"
                    step="25"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(parseInt(e.target.value))}
                    className="flex-1 accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-foreground font-black">Sangat Tebal (+150)</span>
                </div>
              </div>

              {/* Theme Mode & Color Scheme */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Mode Tampilan</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Gunakan mode gelap (Night Mode) di dalam bangsal ICU yang minim cahaya untuk kenyamanan mata.
                    </p>
                  </div>

                  {/* System Theme Link Toggle */}
                  <div className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl">
                    <div>
                      <h5 className="text-sm font-semibold text-foreground">Ikuti Sistem (System Theme)</h5>
                      <p className="text-xs text-muted-foreground">Sesuaikan otomatis dengan pengaturan perangkat</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={themeMode === 'system'}
                        onChange={(e) => setThemeMode(e.target.checked ? 'system' : 'dark')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Manual Dark / Light Toggle */}
                  {themeMode !== 'system' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        onClick={() => setThemeMode('light')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all duration-150 ${
                          themeMode === 'light'
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-muted/10 border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </button>
                      <button
                        onClick={() => setThemeMode('dark')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all duration-150 ${
                          themeMode === 'dark'
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-muted/10 border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </button>
                    </div>
                  )}
                </div>

                {/* Black & White Mode */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Skema Warna</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pilih antara mode berwarna dengan kategori klinis atau mode hitam-putih (B/W).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBwMode(false)}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all duration-150 ${
                        !bwMode
                          ? 'bg-primary/10 border-primary text-primary shadow-sm'
                          : 'bg-muted/10 border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      Warna
                    </button>
                    <button
                      onClick={() => setBwMode(true)}
                      className={`py-3 rounded-xl border font-bold text-sm transition-all duration-150 ${
                        bwMode
                          ? 'bg-primary/10 border-primary text-primary shadow-sm'
                          : 'bg-muted/10 border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      Hitam-Putih
                    </button>
                  </div>
                </div>

                {/* Sound & Haptic Settings */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Suara & Getaran (Haptics)</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mengatur feedback getaran ringan ketika tombol ditekan.
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {vibrationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
                      Feedback Getaran (Haptics)
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={vibrationEnabled}
                        onChange={(e) => setVibrationEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Cache Management */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center justify-between">
                    <span>Update App & Cache</span>
                    <span className="text-xs bg-muted text-muted-foreground border px-2 py-0.5 rounded-full font-mono font-semibold">
                      {estimate.used}
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aplikasi ini berjalan dengan integrasi offline. Jika Anda mengalami kendala fungsional, fitur bermasalah, atau ingin memeriksa update versi terbaru dari aplikasi, ketuk tombol di bawah.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleRefreshCache}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm py-3 px-4 rounded-xl shadow-sm hover:opacity-90 active:scale-[0.99] transition-all"
                  >
                    <RotateCw className="w-4 h-4" />
                    Refresh Cache & Reload App
                  </button>
                  <p className="text-[10.5px] text-center text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                    Data pasien tidak akan hilang
                  </p>
                </div>
              </div>

              {/* Reset Section */}
              <div className="bg-card rounded-2xl border border-red-500/20 shadow-sm p-4 space-y-3 bg-red-500/[0.02]">
                <div>
                  <h4 className="font-bold text-sm text-red-600 flex items-center gap-1.5 dark:text-red-400">
                    <ShieldAlert className="w-4 h-4" />
                    Manajemen Penyimpanan & Disk
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Jika Anda perlu menghapus semua data pasien di Tab Pasien dan mengembalikan preferensi tema ke setelan pabrik murni.
                  </p>
                </div>
                <button
                  onClick={handleResetAllData}
                  className="w-full border border-red-500/30 text-red-600 dark:border-red-500/40 dark:text-red-400 font-bold text-xs py-2.5 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  Hapus Semua Data Pasien & Reset Pengaturan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 2: ABOUT APP */}
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* App Identity Banner */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white font-black text-2xl shadow-md border border-white/10 mb-4">
                  ICU
                </div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-1.5">
                  ICU Helper
                  <span className="text-[10px] font-bold bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    v2.0
                  </span>
                </h2>
                <p className="text-xs text-muted-foreground italic mt-1">
                  Ur bedside clinical companion
                </p>
              </div>

              {/* TENTANG */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
                  TENTANG
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  <strong>ICU Helper</strong> merupakan bagian dari <strong className="text-primary font-bold">MD Kit</strong>, cheatsheet interaktif penanganan masalah klinis pasien kritis, kalkulasi dosis darurat, parameter hemodinamik, pulmo, dan penilaian prognosis pasien di ruang terapi intensif (ICU).
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Dirancang secara presisi menggunakan standar akurasi klinis terbaik untuk membantu Tenaga Medis mengambil keputusan bedside secara cepat, berbasis bukti, dan aman.
                </p>
              </div>

              {/* DIBUAT OLEH */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  DIBUAT OLEH
                </h3>
                <a
                  href="https://id.linkedin.com/in/rizqanfahlevvi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-muted/20 border border-border rounded-xl hover:bg-muted/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0077b5]/10 flex items-center justify-center text-[#0077b5] dark:text-[#00a0dc] border border-[#0077b5]/15">
                      <Linkedin className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Rizqan Fahlevvi</h4>
                      <p className="text-xs text-muted-foreground">Lihat profil LinkedIn →</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all" />
                </a>
              </div>

              {/* MD Kit Ecosystem */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground pl-3">
                  MD KIT — KUNJUNGI HELPER LAINNYA
                </h3>
                <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border overflow-hidden p-1">
                  {/* ICU Helper */}
                  <div className="px-4 py-3.5 flex items-center justify-between bg-primary/[0.03]">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">ICU Helper</h4>
                      <p className="text-xs text-muted-foreground">Panduan tata laksana ICU Dewasa</p>
                    </div>
                    <span className="text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full uppercase">
                      Aplikasi Ini
                    </span>
                  </div>

                  {/* PICNIC Helper */}
                  <a
                    href="https://picnic-helper.pages.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3.5 flex items-center justify-between hover:bg-muted/20 transition-all group text-left"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">PICNIC Helper</h4>
                      <p className="text-xs text-muted-foreground">Pediatric Bedside Decision Support</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>

                  {/* ACLS Helper */}
                  <div className="px-4 py-3.5 flex items-center justify-between text-left opacity-70">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">ACLS Helper</h4>
                      <p className="text-xs text-muted-foreground">Kardiovaskular & Resusitasi Dewasa</p>
                    </div>
                    <span className="text-[9px] font-semibold bg-muted border text-muted-foreground px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>

                  {/* ResNeo Helper */}
                  <div className="px-4 py-3.5 flex items-center justify-between text-left opacity-70">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">ResNeo Helper</h4>
                      <p className="text-xs text-muted-foreground">Resusitasi & Stabilisasi Neonatus</p>
                    </div>
                    <span className="text-[9px] font-semibold bg-muted border text-muted-foreground px-2 py-0.5 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>

              {/* Feedback and Support */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground pl-3">
                  MASUKAN & DUKUNGAN
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/628111111111?text=Halo%20Rizqan,%20berikut%20feedback%20untuk%20ICU%20Helper:"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 bg-card hover:bg-muted/10 border border-border rounded-2xl text-center gap-1.5 transition-colors shadow-sm group"
                  >
                    <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-foreground">Feedback App</span>
                    <span className="text-[10px] text-muted-foreground">Bug, Saran & Komentar</span>
                  </a>
                  <a
                    href="https://saweria.co/rizqan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 bg-card hover:bg-muted/10 border border-border rounded-2xl text-center gap-1.5 transition-colors shadow-sm group"
                  >
                    <Coffee className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform animate-bounce" />
                    <span className="text-xs font-bold text-foreground">Dukung Saweria</span>
                    <span className="text-[10px] text-muted-foreground">Apresiasi Pengembang ☕</span>
                  </a>
                </div>
              </div>

              {/* CHANGELOG */}
              <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
                  <span>CHANGELOG</span>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </h3>

                <div className="space-y-3 divide-y divide-border/60">
                  {/* Version 2.0 */}
                  <div className="pt-2">
                    <button
                      onClick={() => setIsOpenChangelog(prev => ({ ...prev, v2: !prev.v2 }))}
                      className="w-full flex items-center justify-between text-left font-bold text-sm text-foreground focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                          v2.0
                        </span>
                        <span>Update Dashboard & Settings</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpenChangelog.v2 ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpenChangelog.v2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-xs text-muted-foreground space-y-1.5 pl-2 border-l-2 border-primary/10"
                      >
                        <p>• 🧩 Integrasi Penuh <strong>settingsStore</strong> dan preferensi tema gelap/terang global.</p>
                        <p>• 📱 Fitur iOS Theme look-and-feel dengan custom font scale slider.</p>
                        <p>• 🎨 Opsi Mode Tampilan B/W (Kombinatoris Hitam-Putih) untuk akurasi klinis tinggi.</p>
                        <p>• 💾 Fitur estimasi penyimpanan & utility cache manager.</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Version 1.0 */}
                  <div className="pt-3">
                    <button
                      onClick={() => setIsOpenChangelog(prev => ({ ...prev, v1: !prev.v1 }))}
                      className="w-full flex items-center justify-between text-left font-bold text-sm text-foreground focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-muted border text-muted-foreground text-xs">
                          v1.0
                        </span>
                        <span>Rilis Perdana</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpenChangelog.v1 ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpenChangelog.v1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-xs text-muted-foreground space-y-1.5 pl-2 border-l-2 border-border"
                      >
                        <p>• 📊 Implementasi kalkulator ICU dasar (IBW, Renal, ABG Interpreter, Pulmo).</p>
                        <p>• 🧠 Sistem skoring klinis lengkap (SOFA, APACHE II, RASS, CAM-ICU).</p>
                        <p>• 📱 Layout bottom navigation bar dan database pasien offline.</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
