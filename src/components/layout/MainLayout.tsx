import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Calculator, Pill, Menu as MenuIcon, BookOpen, BarChart2, FlaskConical, ClipboardList, BookMarked,
  ArrowDownCircle, Monitor, Settings, History, ChevronLeft, X, Sun, Moon, Users, LogOut,
  ShieldAlert, Lock, ExternalLink, Star, Search, WifiOff, Clock, CheckCircle, LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import {
  activeMobileTab, hasInAppHistory, isNearExpiry, parentPath, readSeenBannerKey,
  shouldShowSubscriptionBanner, subscriptionBannerKey, writeSeenBannerKey, type MobileTabId,
} from '../../utils/shellNav';
import { parseExpiryDate } from '../../utils/subscription';
import { useSettingsStore } from '../../store/settingsStore';
import { useRecentToolsStore } from '../../store/useRecentToolsStore';
import { getFavoritableItemByPath } from '../../data/favoritableItems';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import LogoIcon from '../ui/LogoIcon';
import { useAuth } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/auth';
import { logoutAndClearPatientData } from '../../utils/logout';
import { motion, AnimatePresence } from 'motion/react';
import { ProfilePopup } from '../ProfilePopup';
import GlobalSearch from './GlobalSearch';

type NavItem = {
  name: string;
  path: string;
  icon: LucideIcon;
};

/** Tab nav bawah ponsel — ringkasan menu lengkap; "Lainnya" membuka laci menu. */
const MOBILE_TABS: { id: MobileTabId; label: string; path?: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'patients', label: 'Pasien', path: '/patients', icon: Users },
  { id: 'calculator', label: 'Kalkulator', path: '/calculator', icon: Calculator },
  { id: 'scoring', label: 'Skoring', path: '/scoring', icon: BarChart2 },
  { id: 'more', label: 'Lainnya', icon: LayoutGrid },
];

function SubscriptionBanner({ normalizedSubscriptionStatus, userProfile, isAuthorized }: { normalizedSubscriptionStatus: string, userProfile: any, isAuthorized: boolean }) {
  const [isVisible, setIsVisible] = useState(true);
  // Kunci "sudah dilihat" dibaca SEKALI saat mount → banner tetap terlihat sepanjang sesi
  // pertama, lalu tidak muncul lagi di pembukaan berikutnya (kecuali status berubah / ≤7 hari).
  const seenAtMount = useRef<string | null>(readSeenBannerKey());
  const expiredAt = parseExpiryDate(userProfile?.subscriptionExpiredAt);
  const bannerKey = subscriptionBannerKey(normalizedSubscriptionStatus, expiredAt);
  const shouldShow = isAuthorized && shouldShowSubscriptionBanner(normalizedSubscriptionStatus, expiredAt, seenAtMount.current, new Date());
  const nearExpiry = isNearExpiry(expiredAt, new Date());

  useEffect(() => {
    if (shouldShow && !nearExpiry) writeSeenBannerKey(bannerKey);
  }, [shouldShow, nearExpiry, bannerKey]);

  if (!isVisible || !shouldShow) return null;

  let dateText = "batas waktu belum ditentukan";
  if (expiredAt) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    dateText = expiredAt.toLocaleDateString('id-ID', options);
  }

  const handleClose = () => setIsVisible(false);

  if (normalizedSubscriptionStatus === 'trial') {
    return (
      <div className="relative w-full bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
        <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-full text-amber-600 dark:text-amber-400 shrink-0">
          <Clock size={20} />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-0.5">Anda sedang dalam masa Trial</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300">Akses Anda dibatasi hingga {dateText}. Hubungi kami untuk berlangganan penuh.</p>
        </div>
        <div className="shrink-0 mt-2 sm:mt-0">
          <a
            href={`https://wa.me/6287749076019?text=${encodeURIComponent(`Hai dok, saya ingin berlangganan MD Kit penuh, username saya ${userProfile?.username || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Hubungi WA
          </a>
        </div>
        <button onClick={handleClose} className="absolute top-3 right-3 p-1 text-amber-600/60 hover:text-amber-600 dark:text-amber-400/60 dark:hover:text-amber-400 rounded-full hover:bg-amber-200/50 dark:hover:bg-amber-800/50 transition-colors">
          <X size={16} />
        </button>
      </div>
    );
  }

  if (normalizedSubscriptionStatus === 'active') {
    return (
      <div className="relative w-full bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-full text-emerald-600 dark:text-emerald-400 shrink-0">
          <CheckCircle size={20} />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-0.5">Terima kasih telah berlangganan!</h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">Status langganan Anda aktif hingga {dateText}.</p>
        </div>
        <button onClick={handleClose} className="absolute top-3 right-3 p-1 text-emerald-600/60 hover:text-emerald-600 dark:text-emerald-400/60 dark:hover:text-emerald-400 rounded-full hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 transition-colors">
          <X size={16} />
        </button>
      </div>
    );
  }

  return null;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Pasien', path: '/patients', icon: Users },
  { name: 'Kalkulator', path: '/calculator', icon: Calculator },
  { name: 'Obat & Cairan', path: '/pharmacy', icon: Pill },
  { name: 'Skoring', path: '/scoring', icon: BarChart2 },
  { name: 'Teori', path: '/theory', icon: BookOpen },
  { name: 'ABG', path: '/abg', icon: FlaskConical },
  { name: 'Weaning', path: '/weaning', icon: ArrowDownCircle },
  { name: 'Monitoring', path: '/monitoring', icon: Monitor },
  { name: 'Protokol ICU', path: '/setting', icon: ClipboardList },
  { name: 'Riwayat', path: '/riwayat', icon: History },
  { name: 'Referensi', path: '/reference', icon: BookMarked },
  { name: 'Pengaturan', path: '/settings', icon: Settings }
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

  // "Kembali" aman: tanpa riwayat dalam app (dibuka dari tautan/shortcut) → ke halaman induk.
  const handleBack = () => {
    if (hasInAppHistory(window.history.state)) navigate(-1);
    else navigate(parentPath(location.pathname), { replace: true });
  };

  const activeTab = activeMobileTab(location.pathname);

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
  
  // Active lock checking based on user profile
  const isProfileLocked = !!user && (
    !isAuthorized || 
    (normalizedSubscriptionStatus !== "active" && normalizedSubscriptionStatus !== "trial")
  );

  // The lock only applies to clinical/specific features, not home, settings, or about pages
  const isPathLockedFeature = 
    location.pathname !== '/' && 
    location.pathname !== '/settings' && 
    location.pathname !== '/about' &&
    !location.pathname.startsWith('/admin');

  const isLocked = isProfileLocked && isPathLockedFeature;

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
      case "admin":
        return "Administrator";
      case "pending":
        return "Menunggu Verifikasi";
      default:
        return userProfile.role ? String(userProfile.role).toUpperCase() : "Menunggu Verifikasi";
    }
  };

  const getSubscriptionBadge = () => {
    if (!userProfile) return null;
    
    // SEMENTARA: Karena verifikasi/subscription dinonaktifkan, tampilkan Akses Penuh
    const dotColor = "var(--sys-green)";
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
      await logoutAndClearPatientData();
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
      <aside className={`hidden md:flex flex-col fixed inset-y-0 border-r border-[var(--separator)] bg-[var(--bg-tertiary)] z-10 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-[240px]' : 'w-[80px]'}`}>
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
      <main className={`flex-1 min-w-0 relative flex flex-col h-dvh overflow-hidden transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'md:ml-[240px]' : 'md:ml-[80px]'}`}>
        {/* Unified Top Bar
            Ponsel : halaman induk → logo + judul; halaman anak → ‹ Kembali + judul (sub-nav digabung ke sini).
            Desktop: ≡ melipat sidebar + brand; sub-nav terpisah tetap di bawah header. */}
        <header
          className="ios-nav justify-between relative gap-2"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(60px + env(safe-area-inset-top, 0px))' }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Desktop: ≡ melipat sidebar (di ponsel menu lengkap ada di tab "Lainnya") */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden md:flex p-1.5 items-center justify-center rounded-lg text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)] hover:text-[var(--label-primary)] transition-colors flex-shrink-0"
              title="Lipat / buka sidebar"
              aria-label="Lipat atau buka sidebar"
            >
              <MenuIcon size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 ml-1">
              <LogoIcon className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold text-[16px] tracking-[0px] text-[var(--label-primary)] overflow-hidden whitespace-nowrap">ICU<span className="text-[var(--accent)]">Helper</span></span>
            </div>

            {/* Ponsel */}
            <div className="flex md:hidden items-center gap-1.5 min-w-0 flex-1">
              {isParentMenu ? (
                <LogoIcon className="w-7 h-7 flex-shrink-0" />
              ) : (
                <button
                  onClick={handleBack}
                  className="flex items-center text-[var(--accent)] font-medium -ml-1.5 pr-1 text-[15px] min-h-[44px] flex-shrink-0 active:opacity-60"
                  aria-label="Kembali"
                >
                  <ChevronLeft size={24} className="stroke-[2.5]" />
                  {fontScale <= 1.1 && <span className="hidden min-[360px]:inline">Kembali</span>}
                </button>
              )}
              <h1 className="font-semibold text-[16px] tracking-tight text-[var(--label-primary)] truncate min-w-0">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-1 sm:gap-2.5 z-10 relative flex-shrink-0">
            {/* Indikator offline — ponsel: ikon kecil saja saat offline */}
            {!isOnline && (
              <span
                className="sm:hidden flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400"
                role="status"
                aria-label="Mode offline"
                title="Mode offline — app tetap bisa dipakai, data tersimpan di perangkat."
              >
                <WifiOff size={14} />
              </span>
            )}
            {!isOnline ? (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400" title="Anda sedang dalam mode offline.">
                <WifiOff size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Offline</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400" title="Aplikasi ini siap digunakan tanpa koneksi internet.">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Siap Offline</span>
              </div>
            )}

            {/* Favorit — ponsel (desktop: di sub-nav) */}
            {favoritableItem && !isParentMenu && (
              <button
                onClick={() => toggleFavorite(location.pathname)}
                className="md:hidden w-9 h-11 flex items-center justify-center rounded-full text-[var(--label-secondary)] active:bg-[var(--fill-secondary)]"
                aria-label={isCurrentFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                aria-pressed={isCurrentFav}
              >
                <Star
                  size={19}
                  className={isCurrentFav ? 'fill-[var(--sys-yellow)] text-[var(--sys-yellow)]' : 'text-[var(--label-secondary)]'}
                />
              </button>
            )}

            {user && (
              <div ref={profileDropdownRef} className="flex items-center relative order-last md:order-none">
                <button
                  type="button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 px-1 sm:px-2 py-1.5 rounded-xl hover:bg-[var(--fill-secondary)] transition-colors"
                  aria-label="Menu profil"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <span className="text-sm font-semibold text-[var(--label-primary)] truncate max-w-[120px] md:max-w-[180px] hidden sm:inline">
                    Hi, {getFullNameWithPrefix()}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold text-sm select-none flex-shrink-0 border border-[var(--glass-border)]">
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
                      className="absolute top-[calc(100%+8px)] right-0 w-64 p-3.5 rounded-2xl border border-[var(--separator)] bg-[var(--bg-secondary)] flex flex-col gap-3 shadow-lg z-[100] origin-top-right"
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
                      <div className="border-t border-[var(--separator)] pt-2.5 flex flex-col gap-1">
                        {/* Tema — di ponsel dipindah ke sini dari header */}
                        <button
                          type="button"
                          onClick={toggleTheme}
                          className="md:hidden w-full min-h-[44px] px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-[var(--label-primary)] hover:bg-[var(--fill-secondary)] transition-colors cursor-pointer"
                        >
                          {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                          <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                        </button>
                        {isAdminUser(user, userProfile) ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              navigate('/admin');
                            }}
                            className="w-full min-h-[44px] px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-[var(--sys-blue)] hover:bg-[var(--sys-blue)]/10 transition-colors cursor-pointer"
                          >
                            <ShieldAlert size={14} />
                            <span>Admin Panel</span>
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full min-h-[44px] px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-[var(--sys-red)] hover:bg-[var(--sys-red)]/10 transition-colors cursor-pointer"
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
            <button onClick={() => setIsSearchOpen(true)} className="ios-nav-btn w-10 justify-center md:mr-1" aria-label="Cari">
              <Search size={19} />
            </button>
            {/* Tema — desktop saja (di ponsel ada di menu profil). Dibungkus karena .ios-nav-btn
                (CSS di luar layer) mengalahkan utilitas `hidden`. */}
            <div className="hidden md:flex items-center">
              <div className="w-[1px] h-4 bg-[var(--separator)]"></div>
              <button onClick={toggleTheme} className="ios-nav-btn ml-1" aria-label={isDarkMode ? 'Mode terang' : 'Mode gelap'}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* Sub-nav (desktop saja — di ponsel sudah digabung ke header) */}
        {!isParentMenu && (
          <div className="hidden md:flex h-[46px] items-center justify-between px-2.5 sm:px-4 bg-[var(--bg-secondary)] sticky top-[60px] z-20 w-full relative">
            <div className="flex items-center min-w-[80px]">
              {location.pathname !== '/' && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-0.5 text-[var(--accent)] hover:opacity-80 transition-opacity font-medium -ml-1 text-[15px] py-1 cursor-pointer"
                  title="Kembali"
                >
                  <ChevronLeft size={20} className="stroke-[2.5]" />
                  <span>Kembali</span>
                </button>
              )}
            </div>

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none max-w-[170px] sm:max-w-xs md:max-w-md text-center">
              <h2 className="font-semibold text-[15px] tracking-tight text-[var(--label-primary)] truncate">
                {getPageTitle()}
              </h2>
            </div>

            <div className="flex items-center justify-end min-w-[80px]">
              {favoritableItem && (
                <button
                  onClick={() => toggleFavorite(location.pathname)}
                  className="p-1 px-2.5 rounded-full hover:bg-[var(--fill-secondary)] text-[var(--label-secondary)] hover:text-[var(--sys-yellow)] transition-all flex items-center gap-1 cursor-pointer"
                  title={isCurrentFav ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                >
                  <Star
                    size={16}
                    className={`transition-all duration-200 ${isCurrentFav ? 'fill-[var(--sys-yellow)] text-[var(--sys-yellow)] scale-110' : 'text-[var(--label-secondary)]'}`}
                  />
                  <span className={`text-[12px] font-medium hidden sm:inline ${isCurrentFav ? 'text-[var(--sys-yellow)] font-semibold' : 'text-[var(--label-secondary)]'}`}>
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
                    aria-label="Tutup menu"
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

        <SubscriptionBanner normalizedSubscriptionStatus={normalizedSubscriptionStatus} userProfile={userProfile} isAuthorized={isAuthorized} />

        {/* Scrollable Viewport */}
        <div className={`flex-1 min-w-0 max-w-full px-2.5 sm:px-3 md:px-4 pb-[calc(var(--bottom-nav-h)+24px)] md:pb-0 flex flex-col relative ${isLocked ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden no-scrollbar'}`} id="main-scrollable-viewport">
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
                    background: "var(--sys-orange)",
                    boxShadow: "var(--shadow-2)"
                  }}
                >
                  <Lock size={28} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-[var(--label-primary)]">
                  Fitur Terkunci
                </h3>
                <p className="text-xs text-[var(--label-secondary)] leading-relaxed mb-6 font-medium">
                  {normalizedSubscriptionStatus === "expired" 
                    ? "Masa langganan Anda telah berakhir. Silakan hubungi kami via WhatsApp untuk perpanjangan akses."
                    : "Anda belum mengaktifkan langganan. Silakan hubungi kami via WhatsApp untuk verifikasi akun dan aktivasi akses trial atau berlangganan."}
                </p>
                <a 
                  href={`https://wa.me/6287749076019?text=${encodeURIComponent(`Hai dok, saya sudah daftar MD Kit, username saya ${userProfile?.username || user?.email || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full font-bold px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs cursor-pointer hover:opacity-90"
                  style={{ 
                    backgroundColor: "var(--sys-orange)", 
                    color: "var(--accent-fg)",
                    minHeight: "44px" 
                  }}
                >
                  <span>Hubungi via WhatsApp</span>
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

      {/* Mobile Fixed Bottom Navigation Bar — ringkasan menu; "Lainnya" = menu lengkap */}
      <nav
        aria-label="Navigasi utama"
        className="fixed bottom-0 inset-x-0 z-20 border-t border-[var(--separator)] bg-[var(--material-chrome)] backdrop-blur-md md:hidden shadow-[0_-3px_12px_rgba(0,0,0,0.08)] select-none"
        style={{ height: 'var(--bottom-nav-h)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch h-full w-full justify-around px-1">
          {MOBILE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const cls = `flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-colors text-center relative z-10 ${
              isActive ? 'text-[var(--accent)]' : 'text-[var(--label-tertiary)] hover:text-[var(--label-primary)]'
            }`;
            const inner = (
              <>
                <span className={`px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-[var(--accent-tint)]' : ''}`}>
                  <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className={`text-[10.5px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
              </>
            );
            return tab.path ? (
              <Link key={tab.id} to={tab.path} className={cls} aria-label={tab.label} aria-current={isActive ? 'page' : undefined}>
                {inner}
              </Link>
            ) : (
              <button
                key={tab.id}
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={cls}
                aria-label="Lainnya — buka menu lengkap"
                aria-haspopup="dialog"
                aria-current={isActive ? 'page' : undefined}
              >
                {inner}
              </button>
            );
          })}
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
