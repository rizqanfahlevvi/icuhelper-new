import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Calculator, Pill, Menu as MenuIcon, BookOpen, Activity, 
  ArrowDownCircle, Monitor, Settings, History, BookText, ChevronRight, ChevronLeft, X, Sun, Moon, User, Users, LogOut,
  ShieldAlert, Lock, ExternalLink, Star, Search, WifiOff
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useRecentToolsStore } from '../../store/useRecentToolsStore';
import { getFavoritableItemByPath } from '../../data/favoritableItems';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import LogoIcon from '../ui/LogoIcon';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ProfilePopup } from '../ProfilePopup';
import GlobalSearch from './GlobalSearch';

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
  { name: 'Obat & Cairan', path: '/pharmacy', icon: Pill },
  { name: 'Skoring', path: '/scoring', icon: Activity },
  { name: 'Teori', path: '/theory', icon: BookOpen },
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isCurrentFav = isFavorite(location.pathname);
  const favoritableItem = getFavoritableItemByPath(location.pathname);
  const isParentMenu = NAV_ITEMS.some(item => item.path === location.pathname);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'ICU Helper';
    if (favoritableItem) return favoritableItem.name;
    const navItem = NAV_ITEMS.find(n => n.path === location.pathname || location.pathname.startsWith(n.path + '/'));
    if (navItem) return navItem.name;
    return 'Menu';
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Swipe gesture states
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const { user, userProfile, isAuthorized } = useAuth();

  const normalizedSubscriptionStatus = (userProfile?.subscriptionStatus || "inactive").trim().toLowerCase();
  
  // SEMENTARA: Semua yang mendaftar langsung bisa membuka aplikasi tanpa verifikasi/subscription
  // Untuk mengaktifkan kembali pembatasan, kembalikan isLocked ke pengecekan semula.
  const isLocked = false;
  /*
  const isLocked = !!user && (
    !isAuthorized || 
    (normalizedSubscriptionStatus !== "active" && normalizedSubscriptionStatus !== "trial")
  );
  */

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
    
    // SEMENTARA: Karena verifikasi/subscription dinonaktifkan, tampilkan Akses Penuh
    const dotColor = "var(--sys-green, #34c759)";
    const text = "Akses Penuh";

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
    readingMode,
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
      className="ios-screen flex w-full overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed inset-y-0 border-r border-[#c2c6d4] dark:border-[#3a3d44] bg-[var(--bg-tertiary)] z-10 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-[240px]' : 'w-[80px]'}`}>
        <div className={`flex ${isSidebarExpanded ? 'items-center justify-center px-4' : 'flex-col items-center justify-center px-2'} mt-6 mb-4 h-8`}>
          <div className="flex items-center justify-center gap-3">
            <LogoIcon className="w-8 h-8 flex-shrink-0" />
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.h1 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-[18px] tracking-[0px] text-[var(--label-primary)] overflow-hidden whitespace-nowrap"
                >
                  ICU<span className="text-[var(--accent)]">Helper</span>
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Sidebar Profile Badge */}
        {user && (
          <div className="px-3 mb-4">
            <div 
              className={`flex items-center ${isSidebarExpanded ? 'gap-3 p-3 bg-[var(--fill-secondary)] hover:bg-[var(--fill-tertiary)] cursor-pointer rounded-xl transition-colors' : 'justify-center cursor-pointer'} relative group`}
              onClick={(e) => {
                if (!(e.target as Element).closest('button')) {
                  setIsProfilePopupOpen(true);
                }
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-lg select-none flex-shrink-0 border border-[var(--glass-border)]">
                {getInitialFromProfile()}
              </div>
              <AnimatePresence>
                {isSidebarExpanded && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-grow min-w-0 overflow-hidden whitespace-nowrap pr-8"
                    >
                      <p className="text-sm font-bold text-[var(--label-primary)] truncate" title={getFullNameWithPrefix()}>
                        {getFullNameWithPrefix()}
                      </p>
                      <p className="text-[11px] text-[var(--label-secondary)] truncate mb-0.5">
                        {getRoleLabel()}
                      </p>
                      {getSubscriptionBadge()}
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleLogout}
                      className="absolute right-3 p-1.5 rounded-lg text-[var(--label-secondary)] hover:text-[var(--sys-red)] hover:bg-[var(--sys-red)]/10 transition-colors"
                      title="Keluar"
                    >
                      <LogOut size={16} />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
              {!isSidebarExpanded && (
                <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 bg-[var(--bg-primary)] border border-[var(--glass-border)] shadow-lg rounded-xl px-2 py-1 flex items-center gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-[var(--label-secondary)] hover:text-[var(--sys-red)] hover:bg-[var(--sys-red)]/10 transition-colors"
                    title="Keluar"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col gap-1 no-scrollbar px-3 mt-2">
          <div className="h-4 flex items-center px-3 mb-2">
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] uppercase tracking-[0.1em] text-[var(--label-secondary)] font-bold whitespace-nowrap block"
                >
                  Menu
                </motion.span>
              )}
            </AnimatePresence>
          </div>
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
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 min-w-0 relative flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:ml-[240px]' : 'md:ml-[80px]'}`}>
        {/* Unified Top Bar */}
        <header className="ios-nav justify-between relative">
          {/* Left Brand and Menu Toggles */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileMenuOpen(true);
                } else {
                  setIsSidebarExpanded(!isSidebarExpanded);
                }
              }}
              className="p-1.5 flex items-center justify-center rounded-lg text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--label-primary)] transition-colors flex-shrink-0"
              title="Toggle Menu"
            >
              <MenuIcon size={20} />
            </button>
            <div className="flex items-center gap-2 ml-1">
              <LogoIcon className="w-6 h-6 flex-shrink-0" />
              <h1 className="font-bold text-[16px] tracking-[0px] text-[var(--label-primary)] overflow-hidden whitespace-nowrap hidden md:block">ICU<span className="text-[var(--accent)]">Helper</span></h1>
            </div>
          </div>

          {/* Right Navigation: profile dropdown, separator, and theme switcher */}
          <div className="flex items-center gap-2.5 z-10 relative">
            {!isOnline ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400" title="Anda sedang dalam mode offline.">
                <WifiOff size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Offline Mode</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400" title="Aplikasi ini siap digunakan tanpa koneksi internet.">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Offline Ready</span>
              </div>
            )}
            
            {user && (
              <div ref={profileDropdownRef} className="flex items-center relative">
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5 rounded-xl hover:bg-[var(--fill-secondary)] transition-colors"
                >
                  <span className="text-sm font-semibold text-[var(--label-primary)] truncate max-w-[120px] md:max-w-[180px] hidden sm:inline">
                    Hi, {getFullNameWithPrefix()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-sm select-none flex-shrink-0 border border-[var(--glass-border)] flex">
                    {getInitialFromProfile()}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-[calc(100%+8px)] right-0 w-64 p-3.5 rounded-2xl border border-[#c2c6d4] dark:border-[#3a3d44] bg-[var(--bg-secondary)] flex flex-col gap-3 shadow-lg z-[100] origin-top-right"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-lg select-none flex-shrink-0">
                          {getInitialFromProfile()}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-bold text-[var(--label-primary)] truncate" title={getFullNameWithPrefix()}>
                            {getFullNameWithPrefix()}
                          </p>
                          <p className="text-[11px] text-[var(--label-secondary)] truncate">
                            {getRoleLabel()}
                          </p>
                          {getSubscriptionBadge()}
                        </div>
                      </div>
                      <div className="border-t border-[var(--separator)] pt-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-[#ff3b30] hover:bg-[#ff3b30]/10 transition-colors cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Keluar</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button onClick={() => setIsSearchOpen(true)} className="ios-nav-btn mr-1" aria-label="Search">
              <Search size={18} />
            </button>
            <div className="w-[1px] h-4 bg-[var(--separator)]"></div>
            <button onClick={toggleTheme} className="ios-nav-btn ml-1" aria-label="Toggle theme">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* iOS-Style Sub Navigation Bar */}
        {!isParentMenu && (
          <div className="h-[46px] flex items-center justify-between px-2.5 sm:px-4 bg-[var(--bg-secondary)] sticky top-[60px] z-20 w-full relative">
            {/* Left: Back button with standard iOS blue Chevron and text */}
            <div className="flex items-center min-w-[80px]">
              {location.pathname !== '/' && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-0.5 text-[var(--accent)] hover:opacity-80 transition-opacity font-medium -ml-1 text-[15px] py-1 cursor-pointer"
                  title="Kembali"
                >
                  <ChevronLeft size={20} className="stroke-[2.5]" />
                  <span>Kembali</span>
                </button>
              )}
            </div>

            {/* Center: Screen Title */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none max-w-[170px] sm:max-w-xs md:max-w-md text-center">
              <h2 className="font-semibold text-[15px] tracking-tight text-[var(--label-primary)] truncate">
                {getPageTitle()}
              </h2>
            </div>

            {/* Right: iOS Star Favorite Toggle Button */}
            <div className="flex items-center justify-end min-w-[80px]">
              {favoritableItem && (
                <button
                  onClick={() => toggleFavorite(location.pathname)}
                  className="p-1 px-2.5 rounded-full hover:bg-[var(--fill-secondary)] text-[var(--label-secondary)] hover:text-[#ffcc00] transition-all flex items-center gap-1 cursor-pointer"
                  title={isCurrentFav ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                >
                  <Star 
                    size={16} 
                    className={`transition-all duration-200 ${isCurrentFav ? 'fill-[#ffcc00] text-[#ffcc00] stroke-[#ffcc00] scale-110' : 'text-[var(--label-secondary)]'}`} 
                  />
                  <span className={`text-[12px] font-medium hidden sm:inline ${isCurrentFav ? 'text-[#ffcc00] font-semibold' : 'text-[var(--label-secondary)]'}`}>
                    {isCurrentFav ? 'Favorit' : 'Suka'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile App Sidebar Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[60] md:hidden flex">
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
                
                {/* Mobile Sidebar Profile Badge */}
                {user && (
                  <div className="p-4 border-b border-[var(--separator)]">
                    <div 
                      className="flex items-center gap-3 bg-[var(--fill-secondary)] hover:bg-[var(--fill-tertiary)] cursor-pointer transition-colors p-3 rounded-xl relative"
                      onClick={(e) => {
                        if (!(e.target as Element).closest('button')) {
                          setIsProfilePopupOpen(true);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-lg select-none flex-shrink-0 border border-[var(--glass-border)]">
                        {getInitialFromProfile()}
                      </div>
                      <div className="flex-grow min-w-0 overflow-hidden whitespace-nowrap pr-8">
                        <p className="text-sm font-bold text-[var(--label-primary)] truncate" title={getFullNameWithPrefix()}>
                          {getFullNameWithPrefix()}
                        </p>
                        <p className="text-[11px] text-[var(--label-secondary)] truncate mb-0.5">
                          {getRoleLabel()}
                        </p>
                        {getSubscriptionBadge()}
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="absolute right-3 p-1.5 rounded-lg text-[var(--label-secondary)] hover:text-[var(--sys-red)] hover:bg-[var(--sys-red)]/10 transition-colors"
                        title="Keluar"
                      >
                        <LogOut size={16} />
                      </button>
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
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Scrollable Viewport */}
        <div className={`flex-1 min-w-0 max-w-full px-2.5 sm:px-3 md:px-4 pb-[100px] md:pb-0 flex flex-col relative ${isLocked ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden no-scrollbar'}`} id="main-scrollable-viewport">
          {isLocked && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto bg-white/45 dark:bg-black/45 backdrop-blur-md"
                 id="verification-restriction-overlay"
            >
              <div className="p-8 rounded-3xl ios-card flex flex-col items-center max-w-sm mx-auto shadow-2xl border border-[var(--glass-border)]"
                   style={{ backgroundColor: "var(--bg-tertiary)" }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-[var(--accent-fg)]"
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
                  Anda belum melakukan verifikasi profil anda, Klik tombol verifikasi untuk mendapat akses penuh
                </p>
                <a 
                  href="https://tally.so/r/44EOGr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs cursor-pointer hover:opacity-90"
                  style={{ 
                    backgroundColor: "var(--sys-orange, #ff9500)", 
                    color: "var(--accent-fg)",
                    minHeight: "44px" 
                  }}
                >
                  <span>Verifikasi Sekarang</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
          <div key={location.pathname} className={`w-full min-w-0 max-w-full flex-grow flex flex-col ${isLocked ? 'pointer-events-none select-none' : 'animate-page-route'} ${location.pathname.startsWith('/theory/') && location.pathname !== '/theory' && readingMode ? 'reading-mode' : ''}`}>
            <Outlet />
          </div>
          <footer className="w-full text-center py-6 px-4 mt-auto border-t border-[var(--separator)] text-[11px] text-[var(--label-secondary)] font-medium">
            Untuk panduan klinis, bukan sebagai pengganti penilaian klinis anda sebagai dokter.
          </footer>
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-[var(--separator)] bg-[var(--material-chrome)] backdrop-blur-md h-[74px] md:hidden shadow-[0_-3px_12px_rgba(0,0,0,0.08)] select-none">
        <div className="flex items-stretch h-full w-full justify-around px-2">
          {/* Home Tab */}
          <Link
            to="/"
            className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all text-center relative z-10 ${
              location.pathname === '/'
                ? 'text-[var(--accent)] font-semibold' 
                : 'text-[var(--label-tertiary)] hover:text-[var(--label-primary)]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/' ? 'bg-[var(--accent-tint)] scale-105' : ''}`}>
              <Home className="w-[24px] h-[24px]" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            </div>
          </Link>

          {/* Pasien Tab */}
          <Link
            to="/patients"
            className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all text-center relative z-10 ${
              location.pathname === '/patients' || location.pathname.startsWith('/patients/')
                ? 'text-[var(--accent)] font-semibold' 
                : 'text-[var(--label-tertiary)] hover:text-[var(--label-primary)]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/patients' || location.pathname.startsWith('/patients/') ? 'bg-[var(--accent-tint)] scale-105' : ''}`}>
              <Users className="w-[24px] h-[24px]" strokeWidth={location.pathname === '/patients' || location.pathname.startsWith('/patients/') ? 2.5 : 2} />
            </div>
          </Link>

          {/* Kalkulator Tab */}
          <Link
            to="/calculator"
            className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all text-center relative z-10 ${
              location.pathname === '/calculator' || location.pathname.startsWith('/calculator/')
                ? 'text-[var(--accent)] font-semibold' 
                : 'text-[var(--label-tertiary)] hover:text-[var(--label-primary)]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/calculator' || location.pathname.startsWith('/calculator/') ? 'bg-[var(--accent-tint)] scale-105' : ''}`}>
              <Calculator className="w-[24px] h-[24px]" strokeWidth={location.pathname === '/calculator' || location.pathname.startsWith('/calculator/') ? 2.5 : 2} />
            </div>
          </Link>

          {/* Skoring Tab */}
          <Link
            to="/scoring"
            className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all text-center relative z-10 ${
              location.pathname === '/scoring' || location.pathname.startsWith('/scoring/')
                ? 'text-[var(--accent)] font-semibold' 
                : 'text-[var(--label-tertiary)] hover:text-[var(--label-primary)]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${location.pathname === '/scoring' || location.pathname.startsWith('/scoring/') ? 'bg-[var(--accent-tint)] scale-105' : ''}`}>
              <Activity className="w-[24px] h-[24px]" strokeWidth={location.pathname === '/scoring' || location.pathname.startsWith('/scoring/') ? 2.5 : 2} />
            </div>
          </Link>

          {/* Menu / Lainnya Tab */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-all text-center relative z-10 text-[var(--label-tertiary)] hover:text-[var(--label-primary)]`}
          >
            <div className="p-1.5 rounded-xl transition-all">
              <MenuIcon className="w-[24px] h-[24px]" strokeWidth={2} />
            </div>
          </button>
        </div>
      </nav>
      <ProfilePopup 
        isOpen={isProfilePopupOpen} 
        onClose={() => setIsProfilePopupOpen(false)} 
        onLogout={handleLogout} 
      />
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={(path) => navigate(path)}
      />
    </div>
  );
}
