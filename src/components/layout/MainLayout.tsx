import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, Calculator, Pill, Menu as MenuIcon, BookOpen, Activity, 
  ArrowDownCircle, Monitor, Settings, History, BookText, ChevronRight, ChevronLeft, X, Sun, Moon, User, LogOut,
  ShieldAlert, Lock, ExternalLink
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useRecentToolsStore } from '../../store/useRecentToolsStore';
import { getFavoritableItemByPath } from '../../data/favoritableItems';
import LogoIcon from '../ui/LogoIcon';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

type NavItem = {
  name: string;
  path: string;
  icon: any;
  showInMobileTab?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/', icon: Home, showInMobileTab: true },
  { name: 'Pasien', path: '/patients', icon: User, showInMobileTab: true },
  { name: 'Kalkulator', path: '/calculator', icon: Calculator, showInMobileTab: true },
  { name: 'Drugs', path: '/drug-reference', icon: Pill },
  { name: 'Skoring', path: '/scoring', icon: Activity },
  { name: 'Teori', path: '/theory', icon: BookOpen },
  { name: 'Cairan', path: '/cairan', icon: Activity },
  { name: 'ABG', path: '/abg', icon: Activity },
  { name: 'Weaning', path: '/weaning', icon: ArrowDownCircle },
  { name: 'Monitoring', path: '/monitoring', icon: Monitor },
  { name: 'Protokol ICU', path: '/setting', icon: BookText },
  { name: 'Riwayat', path: '/riwayat', icon: History },
  { name: 'Referensi', path: '/reference', icon: BookText },
  { name: 'Pengaturan', path: '/settings', icon: Settings, showInMobileTab: true }
];

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Swipe gesture states
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const { user, userProfile, isAuthorized } = useAuth();

  const isLocked = !!user && (
    !isAuthorized || 
    (userProfile?.subscriptionStatus === "inactive" || userProfile?.subscriptionStatus === "expired")
  );

  const getInitialFromProfile = () => {
    const name = userProfile?.namaLengkap || userProfile?.username || user?.email || 'U';
    return name[0].toUpperCase();
  };

  const getFullNameWithPrefix = () => {
    if (!userProfile) return user?.email || 'Guest';
    const name = userProfile.namaLengkap || userProfile.username;
    if (!userProfile.namaLengkap) {
      return name;
    }
    switch (userProfile.role) {
      case 'doctor':
      case 'resident':
        return `dr. ${name}`;
      case 'specialist':
        return `dr. Sp. ${name}`;
      case 'pending':
      default:
        return name;
    }
  };

  const getRoleLabel = () => {
    if (!userProfile) return "";
    switch (userProfile.role) {
      case "doctor":
        return "Dokter Umum";
      case "resident":
        return "Residen / PPDS";
      case "specialist":
        return "Dokter Spesialis";
      case "pending":
        return "Menunggu Verifikasi";
      default:
        return userProfile.role ? userProfile.role.toUpperCase() : "Menunggu Verifikasi";
    }
  };

  const getSubscriptionBadge = () => {
    if (!userProfile) return null;
    const status = userProfile.subscriptionStatus || "inactive";
    let dotColor = "var(--sys-red, #ff3b30)";
    let text = "Belum Berlangganan";

    switch (status) {
      case "active":
        dotColor = "var(--sys-green, #34c759)";
        text = "Subscription Aktif";
        break;
      case "trial":
        dotColor = "var(--sys-orange, #ff9500)";
        text = "Masa Trial";
        break;
      case "inactive":
        dotColor = "var(--sys-red, #ff3b30)";
        text = "Belum Berlangganan";
        break;
      case "expired":
        dotColor = "var(--sys-red, #ff3b30)";
        text = "Subscription Habis";
        break;
    }

    return (
      <div className="flex items-center gap-1.5 mt-1 select-none">
        <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: dotColor }} />
        <span className="text-[10px] font-medium leading-none" style={{ color: "var(--label-secondary)" }}>
          {text}
        </span>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Gagal keluar:", err);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;

    // Check if horizontal touch is dominant
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Swipe from left to right (near left edge) to open sidebar
      if (!isMobileMenuOpen && touchStartX < 50 && diffX > 60) {
        setIsMobileMenuOpen(true);
        setTouchStartX(null);
        setTouchStartY(null);
      }
      // Swipe from right to left to close active sidebar
      else if (isMobileMenuOpen && diffX < -60) {
        setIsMobileMenuOpen(false);
        setTouchStartX(null);
        setTouchStartY(null);
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const {
    fontFamily,
    fontScale,
    fontWeight,
    themeMode,
    bwMode,
    setThemeMode
  } = useSettingsStore();

  const addRecentPath = useRecentToolsStore(state => state.addRecentPath);

  useEffect(() => {
    // Check if the current route is a calculator/tool
    const item = getFavoritableItemByPath(location.pathname);
    if (item && item.category === 'Kalkulator') {
      addRecentPath(location.pathname);
    }
  }, [location.pathname, addRecentPath]);

  const isDarkMode = 
    themeMode === 'dark' || 
    (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

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

  return (
    <div 
      className="ios-screen flex w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed inset-y-0 border-r border-[#c2c6d4] dark:border-[#3a3d44] bg-[var(--bg-tertiary)] z-10 transition-all duration-300 ${isSidebarExpanded ? 'w-[240px]' : 'w-[80px]'}`}>
        <div className={`flex ${isSidebarExpanded ? 'items-center justify-between px-4' : 'flex-col items-center gap-4 px-2'} mt-6 mb-4`}>
          <div className={`flex items-center ${isSidebarExpanded ? 'gap-3' : 'justify-center'}`}>
            <LogoIcon className="w-8 h-8 flex-shrink-0" />
            {isSidebarExpanded && <h1 className="font-bold text-[18px] tracking-[0px] text-[var(--label-primary)] overflow-hidden whitespace-nowrap">ICU<span className="text-[var(--accent)]">Helper</span></h1>}
          </div>
          <button 
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="p-1.5 flex items-center justify-center rounded-lg text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--label-primary)] transition-colors flex-shrink-0"
            title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* User Profile Card (Moved to Top) */}
        {user && (
          <div className="px-3 mb-4">
            {isSidebarExpanded ? (
              <div className="p-3 rounded-xl border border-[#c2c6d4] dark:border-[#3a3d44] bg-[var(--bg-secondary)] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-sm select-none flex-shrink-0">
                  {getInitialFromProfile()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--label-primary)] truncate-2-lines" title={getFullNameWithPrefix()}>
                    {getFullNameWithPrefix()}
                  </p>
                  <p className="text-[11px] text-[var(--label-secondary)] truncate">
                    {getRoleLabel()}
                  </p>
                  {getSubscriptionBadge()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div 
                  className="w-9 h-9 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-sm select-none"
                  title={getFullNameWithPrefix()}
                >
                  {getInitialFromProfile()}
                </div>
              </div>
            )}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto flex flex-col gap-1 no-scrollbar px-3">
          {isSidebarExpanded && <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--label-secondary)] font-bold mb-3 px-3 block whitespace-nowrap">Menu</span>}
          {!isSidebarExpanded && <div className="h-2"></div>}
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                title={!isSidebarExpanded ? item.name : undefined}
                className={`flex items-center px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive 
                    ? 'bg-[var(--accent-tint)] text-[var(--accent)]' 
                    : 'text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--label-primary)]'
                } ${isSidebarExpanded ? 'gap-3' : 'justify-center'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="whitespace-nowrap overflow-hidden">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        {/* User Profile Footer (Logout Only) */}
        {user && (
          <div className="p-4 border-t border-[#c2c6d4] dark:border-[#3a3d44] bg-[var(--bg-tertiary)] flex flex-col gap-2.5">
            {isSidebarExpanded ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: "var(--sys-red, #ff3b30)" }}
                id="btn-sidebar-desktop-logout"
              >
                <LogOut size={14} />
                <span>Keluar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-10 h-10 mx-auto rounded-full bg-[var(--accent)]/10 text-[var(--sys-red, #ff3b30)] flex items-center justify-center hover:bg-[var(--fill-secondary)] transition-colors cursor-pointer"
                title="Sistem Keluar"
                id="btn-sidebar-desktop-logout-collapsed"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 relative w-full flex flex-col h-screen overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'md:ml-[240px]' : 'md:ml-[80px]'}`}>
        {/* Mobile Top Bar */}
        <header className="ios-nav md:hidden">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="ios-nav-btn p-1 -ml-1" aria-label="Open menu">
              <MenuIcon size={20} />
            </button>
            <LogoIcon className="w-6 h-6 flex-shrink-0" />
            <span className="ios-nav-title">ICU</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="ios-nav-btn" aria-label="Toggle theme">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Mobile App Sidebar Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              {/* Overlay */}
              <motion.div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Sidebar content */}
              <motion.aside 
                className="relative flex flex-col w-[280px] max-w-[80vw] h-full bg-[var(--bg-tertiary)] shadow-2xl"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
              >
                <div className="flex items-center justify-between p-4 px-6 border-b border-[var(--separator)]">
                  <div className="flex items-center gap-3">
                    <LogoIcon className="w-8 h-8 flex-shrink-0" />
                    <h1 className="font-bold text-[18px] tracking-[0px] text-[var(--label-primary)]">ICU<span className="text-[var(--accent)]">Helper</span></h1>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full bg-[var(--fill-tertiary)] text-[var(--label-secondary)] hover:text-[var(--label-primary)]"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* User Profile Card for Mobile Sidebar (Moved to Top) */}
                {user && (
                  <div className="p-4 border-b border-[var(--separator)] bg-[var(--bg-secondary)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-lg select-none flex-shrink-0">
                      {getInitialFromProfile()}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-[var(--label-primary)] truncate" title={getFullNameWithPrefix()}>
                        {getFullNameWithPrefix()}
                      </p>
                      <p className="text-xs text-[var(--label-secondary)] truncate">
                        {getRoleLabel()}
                      </p>
                      {getSubscriptionBadge()}
                    </div>
                  </div>
                )}

                <nav className="flex-1 overflow-y-auto flex flex-col gap-1 p-4 pb-20 no-scrollbar">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--label-secondary)] font-bold mb-3 px-2 block">Menu Utama</span>
                  {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                      <Link
                        key={`mobile-${item.name}`}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                          isActive 
                            ? 'bg-[var(--accent-tint)] text-[var(--accent)] font-bold' 
                            : 'text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--label-primary)]'
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                 {/* User Profile Footer for Mobile Sidebar (Logout Only) */}
                {user && (
                  <div className="p-4 border-t border-[var(--separator)] bg-[var(--bg-tertiary)] flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: "var(--sys-red, #ff3b30)" }}
                      id="btn-sidebar-mobile-logout"
                    >
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto w-full no-scrollbar pb-[100px] md:pb-0 flex flex-col relative" id="main-scrollable-viewport">
          {isLocked && (
            <div className="absolute inset-x-0 top-0 bottom-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto bg-white/45 dark:bg-black/45 backdrop-blur-md"
                 id="verification-restriction-overlay"
            >
              <div className="p-8 rounded-3xl ios-card flex flex-col items-center max-w-sm mx-auto shadow-2xl border border-[var(--glass-border)]"
                   style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white"
                  style={{ 
                    background: "linear-gradient(135deg, var(--sys-orange, #ff9500), #ffb340)",
                    boxShadow: "0 4px 12px rgba(255, 149, 0, 0.25)"
                  }}
                >
                  <Lock size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--label-primary)]">
                  Fitur Terkunci
                </h3>
                <p className="text-xs text-[var(--label-secondary)] leading-relaxed mb-6 font-medium">
                  Anda belum melakukan verifikasi profile dokter dengan lengkapi form dibawah
                </p>
                <a 
                  href="https://tally.so/r/44EOGr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full font-bold text-white px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs cursor-pointer"
                  style={{ backgroundColor: "var(--sys-orange, #ff9500)", minHeight: "44px" }}
                >
                  <span>Verifikasi Sekarang</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
          <div key={location.pathname} className={`w-full flex-grow flex flex-col ${isLocked ? 'pointer-events-none select-none filter blur-[2px]' : 'animate-page-route'}`}>
            <Outlet />
          </div>
          <footer className="w-full text-center py-6 px-4 mt-auto border-t border-[var(--separator)] text-[11px] text-[var(--label-secondary)] font-medium">
            Untuk panduan klinis, bukan sebagai pengganti penilaian klinis anda sebagai dokter.
          </footer>
        </div>
      </main>

      {/* Mobile Swipeable Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-[var(--separator)] bg-[var(--material-chrome)] backdrop-blur-md h-[74px] md:hidden shadow-[0_-3px_12px_rgba(0,0,0,0.08)] select-none">
        <div className="relative h-full w-full">
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex items-stretch h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex-shrink-0 w-1/5 snap-start h-full flex flex-col items-center justify-center gap-0.5 transition-all text-center relative z-10 ${
                    isActive 
                      ? 'text-[var(--accent)] font-semibold' 
                      : 'text-[var(--label-tertiary)] hover:text-[var(--label-primary)]'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[var(--accent-tint)] scale-105' : ''}`}>
                    <item.icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[10px] tracking-tight font-medium block whitespace-nowrap px-0.5">{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Visual Indicator (Fade di kiri) */}
          <div 
            className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--material-chrome)] to-transparent pointer-events-none transition-opacity duration-300 z-20 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`} 
          />
          
          {/* Visual Indicator (Fade di kanan) agar user tahu bisa discroll */}
          <div 
            className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--material-chrome)] to-transparent pointer-events-none transition-opacity duration-300 z-20 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`} 
          />
        </div>
      </nav>
    </div>
  );
}
