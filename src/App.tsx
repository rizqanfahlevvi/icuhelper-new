/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useSettingsStore } from './store/settingsStore';

import Home from './pages/Home';
import AboutSettings from './pages/AboutSettings';
import PlaceholderPage from './pages/PlaceholderPage';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { ShieldAlert, ExternalLink, LogOut } from 'lucide-react';

import PatientsPage from './pages/PatientsPage';
import CalculatorIndex from './pages/calculator/CalculatorIndex';
import ScoringIndex from './pages/scoring/ScoringIndex';
import TheoryIndex from './pages/theory/TheoryIndex';
import Reference from './pages/Reference';
import Riwayat from './pages/Riwayat';
import SettingIndex from './pages/setting';
import MonitoringIndex from './pages/monitoring';
import WeaningIndex from './pages/weaning';
import AbgPage from './pages/abg';
import PharmacyIndex from './pages/pharmacy';
import AdminPage from './pages/AdminPage';

import KalkulatorIBW from './pages/calculator/KalkulatorIBW';
import KalkulatorRenal from './pages/calculator/KalkulatorRenal';
import KalkulatorPF from './pages/calculator/KalkulatorPF';
import KalkulatorPulmo from './pages/calculator/KalkulatorPulmo';
import KalkulatorKebutuhanCairan from './pages/calculator/KalkulatorKebutuhanCairan';
import KalkulatorDrug from './pages/calculator/KalkulatorDrug';
import KalkulatorElektro from './pages/calculator/KalkulatorElektro';
import KalkulatorPump from './pages/calculator/KalkulatorPump';
import KalkulatorNlr from './pages/calculator/KalkulatorNlr';
import KalkulatorTransfusi from './pages/calculator/KalkulatorTransfusi';
import KalkulatorInsulin from './pages/calculator/KalkulatorInsulin';
import KalkulatorNutrisi from './pages/calculator/KalkulatorNutrisi';
import KalkulatorVentilatorAdv from './pages/calculator/KalkulatorVentilatorAdv';
import KalkulatorAnionGap from './pages/calculator/KalkulatorAnionGap';

import TeoriImpending from './pages/theory/TeoriImpending';
import TeoriGagalNapas from './pages/theory/TeoriGagalNapas';
import TeoriAirway from './pages/theory/TeoriAirway';
import TeoriSepsis from './pages/theory/TeoriSepsis';
import TeoriDKAHHS from './pages/theory/TeoriDKAHHS';
import TeoriFisiologi from './pages/theory/TeoriFisiologi';
import TeoriSyok from './pages/theory/TeoriSyok';
import TeoriB1B6 from './pages/theory/TeoriB1B6';
import TeoriSATSBT from './pages/theory/TeoriSATSBT';
import TeoriNutrisi from './pages/theory/TeoriNutrisi';
import TeoriAKICRRT from './pages/theory/TeoriAKICRRT';
import TeoriAGD from './pages/theory/TeoriAGD';
import TeoriVentilatorDasar from './pages/theory/TeoriVentilatorDasar';
import TeoriTIK from './pages/theory/TeoriTIK';
import TeoriPADIS from './pages/theory/TeoriPADIS';
import TeoriCardiacRhythm from './pages/theory/TeoriCardiacRhythm';

import ScoringApache from './pages/scoring/ScoringApache';
import ScoringBfs from './pages/scoring/ScoringBfs';
import ScoringCamicu from './pages/scoring/ScoringCamicu';
import ScoringCandida from './pages/scoring/ScoringCandida';
import ScoringCpis from './pages/scoring/ScoringCpis';
import ScoringRass from './pages/scoring/ScoringRass';
import ScoringSofa from './pages/scoring/ScoringSofa';
import ScoringWells from './pages/scoring/ScoringWells';

import { PwaInstallPrompt } from './components/PwaInstallPrompt';

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

    // Apply font families
    const fontsMap = {
      lexend: '"Lexend", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      inter: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      roboto: '"Roboto", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      jetbrains: '"JetBrains Mono", monospace',
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };
    root.style.setProperty('--font-sans', fontsMap[fontFamily]);

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
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
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
        <PwaInstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  );
}
