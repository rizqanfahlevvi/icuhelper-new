import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const hasDismissed = localStorage.getItem('pwa_install_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if running in standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    // For iOS, show instructions if not standalone
    if (isIosDevice && !isStandalone) {
      const hasDismissed = localStorage.getItem('pwa_install_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    }

    // fallback for testing if no event fires and we want to show it:
    // This allows desktop users or android users to see the banner 
    // even if they don't meet all PWA criteria yet (like service worker)
    // Uncomment for testing if needed
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname.includes('run.app');
    if (!isIosDevice && !isStandalone && isLocalhost) {
      const hasDismissed = localStorage.getItem('pwa_install_dismissed');
      if (!hasDismissed) {
         // Add small delay so it doesn't pop immediately on load
         setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIos) {
      alert('Untuk menginstal di iOS: ketuk tombol Bagikan (Share) di bawah layar browser, lalu pilih "Tambah ke Layar Utama" (Add to Home Screen).');
    } else {
      alert('Untuk menginstal, klik icon install di address bar browser Anda (biasanya di sebelah kanan URL) atau pilih "Tambahkan ke Layar Utama" / "Install App" dari menu browser.');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div 
        className="border shadow-xl p-4 w-72 md:w-80 relative flex gap-4 ios-card"
        style={{ 
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--glass-border)',
          borderRadius: 'var(--r-card)'
        }}
      >
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full transition-colors opacity-70 hover:opacity-100"
          style={{ color: 'var(--label-secondary)' }}
        >
          <X size={16} />
        </button>
        
        <div className="flex-shrink-0 pt-1">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ 
              backgroundColor: 'var(--sys-blue)',
              color: 'var(--accent-fg)' 
            }}
          >
            <Download size={20} />
          </div>
        </div>
        
        <div className="flex-1 pr-3">
          <h4 className="font-bold text-sm mb-1 tracking-tight" style={{ color: 'var(--label-primary)' }}>
            Instal Aplikasi
          </h4>
          <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--label-secondary)' }}>
            {isIos 
              ? 'Tambahkan ke layar utama (Home Screen) untuk akses cepat.'
              : 'Instal aplikasi ini di perangkat Anda untuk pengalaman yang lebih baik.'}
          </p>
          
          <button 
            onClick={handleInstallClick}
            className="w-full font-semibold py-2 px-3 rounded-lg text-xs active:scale-[0.98] transition-transform shadow-sm"
            style={{ 
              backgroundColor: 'var(--sys-blue)', 
              color: 'var(--accent-fg)' 
            }}
          >
            {isIos ? 'Cara Instal' : 'Instal Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
