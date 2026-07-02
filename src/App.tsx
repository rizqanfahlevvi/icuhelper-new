/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useSettingsStore } from './store/settingsStore';
import PageSkeleton from './components/ui/PageSkeleton';
import { AuthProvider, useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { ShieldAlert, ExternalLink, LogOut } from 'lucide-react';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { loadFont } from './utils/fontLoader';

const Home = lazy(() => import('./pages/Home'));
const AboutSettings = lazy(() => import('./pages/AboutSettings'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));

const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const CalculatorIndex = lazy(() => import('./pages/calculator/CalculatorIndex'));
const ScoringIndex = lazy(() => import('./pages/scoring/ScoringIndex'));
const TheoryIndex = lazy(() => import('./pages/theory/TheoryIndex'));
const Reference = lazy(() => import('./pages/Reference'));
const Riwayat = lazy(() => import('./pages/Riwayat'));
const SettingIndex = lazy(() => import('./pages/setting'));
const MonitoringIndex = lazy(() => import('./pages/monitoring'));
const WeaningIndex = lazy(() => import('./pages/weaning'));
const AbgPage = lazy(() => import('./pages/abg'));
const PharmacyIndex = lazy(() => import('./pages/pharmacy'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const KalkulatorIBW = lazy(() => import('./pages/calculator/KalkulatorIBW'));
const KalkulatorRenal = lazy(() => import('./pages/calculator/KalkulatorRenal'));
const KalkulatorPF = lazy(() => import('./pages/calculator/KalkulatorPF'));
const KalkulatorPulmo = lazy(() => import('./pages/calculator/KalkulatorPulmo'));
const KalkulatorKebutuhanCairan = lazy(() => import('./pages/calculator/KalkulatorKebutuhanCairan'));
const KalkulatorDrug = lazy(() => import('./pages/calculator/KalkulatorDrug'));
const KalkulatorElektro = lazy(() => import('./pages/calculator/KalkulatorElektro'));
const KalkulatorPump = lazy(() => import('./pages/calculator/KalkulatorPump'));
const KalkulatorNlr = lazy(() => import('./pages/calculator/KalkulatorNlr'));
const KalkulatorTransfusi = lazy(() => import('./pages/calculator/KalkulatorTransfusi'));
const KalkulatorInsulin = lazy(() => import('./pages/calculator/KalkulatorInsulin'));
const KalkulatorNutrisi = lazy(() => import('./pages/calculator/KalkulatorNutrisi'));
const KalkulatorVentilatorAdv = lazy(() => import('./pages/calculator/KalkulatorVentilatorAdv'));
const KalkulatorBurn = lazy(() => import('./pages/calculator/KalkulatorBurn'));
const KalkulatorAnionGap = lazy(() => import('./pages/calculator/KalkulatorAnionGap'));

const TeoriImpending = lazy(() => import('./pages/theory/TeoriImpending'));
const TeoriGagalNapas = lazy(() => import('./pages/theory/TeoriGagalNapas'));
const TeoriAirway = lazy(() => import('./pages/theory/TeoriAirway'));
const TeoriSepsis = lazy(() => import('./pages/theory/TeoriSepsis'));
const TeoriDKAHHS = lazy(() => import('./pages/theory/TeoriDKAHHS'));
const TeoriFisiologi = lazy(() => import('./pages/theory/TeoriFisiologi'));
const TeoriSyok = lazy(() => import('./pages/theory/TeoriSyok'));
const TeoriB1B6 = lazy(() => import('./pages/theory/TeoriB1B6'));
const TeoriSATSBT = lazy(() => import('./pages/theory/TeoriSATSBT'));
const TeoriNutrisi = lazy(() => import('./pages/theory/TeoriNutrisi'));
const TeoriAKICRRT = lazy(() => import('./pages/theory/TeoriAKICRRT'));
const TeoriAGD = lazy(() => import('./pages/theory/TeoriAGD'));
const TeoriVentilatorDasar = lazy(() => import('./pages/theory/TeoriVentilatorDasar'));
const TeoriTIK = lazy(() => import('./pages/theory/TeoriTIK'));
const TeoriPADIS = lazy(() => import('./pages/theory/TeoriPADIS'));
const TeoriCardiacRhythm = lazy(() => import('./pages/theory/TeoriCardiacRhythm'));

const ScoringApache = lazy(() => import('./pages/scoring/ScoringApache'));
const ScoringBfs = lazy(() => import('./pages/scoring/ScoringBfs'));
const ScoringCamicu = lazy(() => import('./pages/scoring/ScoringCamicu'));
const ScoringCandida = lazy(() => import('./pages/scoring/ScoringCandida'));
const ScoringCpis = lazy(() => import('./pages/scoring/ScoringCpis'));
const ScoringRass = lazy(() => import('./pages/scoring/ScoringRass'));
const ScoringSofa = lazy(() => import('./pages/scoring/ScoringSofa'));
const ScoringWells = lazy(() => import('./pages/scoring/ScoringWells'));

function VerificationPage() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div 
        className="w-full max-w-md p-6 text-center ios-card"
        style={{ 
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "var(--r-card)",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-2)"
        }}
        id="verification-card"
      >
        <div className="flex flex-col items-center mb-6 text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-[var(--accent-fg)] animate-pulse"
            style={{ 
              background: "linear-gradient(135deg, var(--sys-orange, #ff9500), #ffb340)",
              boxShadow: "0 4px 12px rgba(255, 149, 0, 0.25)"
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h1 
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ color: "var(--label-primary)" }}
          >
            Akun Dalam Verifikasi
          </h1>
          <p 
            className="text-base leading-relaxed mb-6"
            style={{ color: "var(--label-secondary)" }}
          >
            Terima kasih sudah mendaftar! Akun Anda sedang dalam proses verifikasi. Silakan lengkapi profil dokter Anda terlebih dahulu.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="https://tally.so/r/44EOGr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-semibold shadow-sm flex items-center justify-center gap-2 px-4 py-3 active:scale-[0.98] hover:opacity-90 transition-all cursor-pointer"
            style={{
              backgroundColor: "var(--sys-blue)",
              color: "var(--accent-fg)",
              borderRadius: "12px",
              minHeight: "44px"
            }}
            id="btn-complete-profile"
          >
            <span>Lengkapi Profil Dokter</span>
            <ExternalLink size={16} />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full font-semibold border flex items-center justify-center gap-2 px-4 py-3 animate-fade-in transition-all duration-200 hover:opacity-95 cursor-pointer text-[var(--sys-red)] border-[var(--glass-border)] bg-[var(--bg-tertiary)] dark:text-red-400 dark:border-red-950/60 dark:bg-red-950/20"
            style={{
              borderRadius: "12px",
              minHeight: "44px"
            }}
            id="btn-logout"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 text-center" 
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--label-secondary)" }}>
          Memuat data otentikasi...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const { fontFamily, fontScale, fontWeight, themeMode, bwMode } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply font scale
    root.style.setProperty('--font-scale', fontScale.toString());

    // Apply font weights
    const lightWeight = Math.max(100, Math.min(900, 300 + fontWeight));
    const normalWeight = Math.max(100, Math.min(900, 400 + fontWeight));
    const mediumWeight = Math.max(100, Math.min(900, 500 + fontWeight));
    const semiboldWeight = Math.max(100, Math.min(900, 600 + fontWeight));
    const boldWeight = Math.max(100, Math.min(900, 700 + fontWeight));
    const extraboldWeight = Math.max(100, Math.min(900, 800 + fontWeight));
    const blackWeight = Math.max(100, Math.min(900, 900 + fontWeight));

    root.style.setProperty('--fw-light', lightWeight.toString());
    root.style.setProperty('--fw-normal', normalWeight.toString());
    root.style.setProperty('--fw-medium', mediumWeight.toString());
    root.style.setProperty('--fw-semibold', semiboldWeight.toString());
    root.style.setProperty('--fw-bold', boldWeight.toString());
    root.style.setProperty('--fw-extrabold', extraboldWeight.toString());
    root.style.setProperty('--fw-black', blackWeight.toString());

    // Inject the chosen font's stylesheet on demand (no-op for lexend/system)
    loadFont(fontFamily);

    // Apply font families
    const fontsMap: Record<string, string> = {
      lexend: '"Lexend", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      inter: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      roboto: '"Roboto", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      jetbrains: '"JetBrains Mono", monospace',
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      poppins: '"Poppins", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      montserrat: '"Montserrat", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      'plus-jakarta': '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      outfit: '"Outfit", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      'space-grotesk': '"Space Grotesk", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      'fira-code': '"Fira Code", monospace',
      quicksand: '"Quicksand", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    };
    root.style.setProperty('--font-sans', fontsMap[fontFamily] || fontsMap.system);

    // Apply Black & White Mode
    if (bwMode) {
      root.classList.add('bw-mode');
    } else {
      root.classList.remove('bw-mode');
    }

    // Apply Dark Class
    const updateTheme = () => {
      const isDark = 
        themeMode === 'dark' || 
        (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    };

    updateTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [fontFamily, fontScale, fontWeight, themeMode, bwMode]);

  useEffect(() => {
    // Enable transition after initial load to prevent flicker
    const timer = setTimeout(() => {
      document.documentElement.classList.add('theme-transition');
    }, 50);

    // Clear chunk-reload key if app loaded successfully
    try {
      sessionStorage.removeItem('chunk-failed-reload');
    } catch (e) {
      console.warn("Failed to clear chunk reload storage:", e);
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/patients" element={<PatientsPage />} />
                
                {/* Kalkulator Routes */}
                <Route path="/calculator" element={<CalculatorIndex />} />
                <Route path="/calculator/cairan" element={<KalkulatorKebutuhanCairan />} />
                <Route path="/calculator/drug" element={<KalkulatorDrug />} />
                <Route path="/calculator/electro" element={<KalkulatorElektro />} />
                <Route path="/calculator/ibw" element={<KalkulatorIBW />} />
                <Route path="/calculator/insulin" element={<KalkulatorInsulin />} />
                <Route path="/calculator/nlr" element={<KalkulatorNlr />} />
                <Route path="/calculator/nutrisi" element={<KalkulatorNutrisi />} />
                <Route path="/calculator/pf" element={<KalkulatorPF />} />
                <Route path="/calculator/pulmo" element={<KalkulatorPulmo />} />
                <Route path="/calculator/pump" element={<KalkulatorPump />} />
                <Route path="/calculator/renal" element={<KalkulatorRenal />} />
                <Route path="/calculator/transfusi" element={<KalkulatorTransfusi />} />
                <Route path="/calculator/ventilator-adv" element={<KalkulatorVentilatorAdv />} />
                <Route path="/calculator/burn" element={<KalkulatorBurn />} />
                <Route path="/calculator/anion-gap" element={<KalkulatorAnionGap />} />
                
                {/* Teori Routes */}
                <Route path="/theory" element={<TheoryIndex />} />
                <Route path="/theory/agd" element={<TeoriAGD />} />
                <Route path="/theory/airway" element={<TeoriAirway />} />
                <Route path="/theory/aki-crrt" element={<TeoriAKICRRT />} />
                <Route path="/theory/b1b6" element={<TeoriB1B6 />} />
                <Route path="/theory/dka-hhs" element={<TeoriDKAHHS />} />
                <Route path="/theory/fisiologi" element={<TeoriFisiologi />} />
                <Route path="/theory/gagalnapas" element={<TeoriGagalNapas />} />
                <Route path="/theory/impending" element={<TeoriImpending />} />
                <Route path="/theory/nutrisi" element={<TeoriNutrisi />} />
                <Route path="/theory/padis" element={<TeoriPADIS />} />
                <Route path="/theory/sat-sbt-vap" element={<TeoriSATSBT />} />
                <Route path="/theory/sepsis" element={<TeoriSepsis />} />
                <Route path="/theory/syok" element={<TeoriSyok />} />
                <Route path="/theory/tik" element={<TeoriTIK />} />
                <Route path="/theory/vent-dasar" element={<TeoriVentilatorDasar />} />
                <Route path="/theory/cardiac-rhythm" element={<TeoriCardiacRhythm />} />
                
                {/* Skoring Routes */}
                <Route path="/scoring" element={<ScoringIndex />} />
                <Route path="/scoring/apache" element={<ScoringApache />} />
                <Route path="/scoring/bfs" element={<ScoringBfs />} />
                <Route path="/scoring/camicu" element={<ScoringCamicu />} />
                <Route path="/scoring/candida" element={<ScoringCandida />} />
                <Route path="/scoring/cpis" element={<ScoringCpis />} />
                <Route path="/scoring/rass" element={<ScoringRass />} />
                <Route path="/scoring/sofa" element={<ScoringSofa />} />
                <Route path="/scoring/wells" element={<ScoringWells />} />
                
                {/* Other Tools / Root Routes */}
                <Route path="/pharmacy" element={<PharmacyIndex />} />
                <Route path="/abg" element={<AbgPage />} />
                <Route path="/weaning" element={<WeaningIndex />} />
                <Route path="/monitoring" element={<MonitoringIndex />} />
                <Route path="/setting" element={<SettingIndex />} />
                <Route path="/settings" element={<AboutSettings />} />
                <Route path="/about" element={<AboutSettings />} />
                <Route path="/riwayat" element={<Riwayat />} />
                <Route path="/reference" element={<Reference />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
        <PwaInstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  );
}
