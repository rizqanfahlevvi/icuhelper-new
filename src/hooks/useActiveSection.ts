import { useEffect, useState } from 'react';

/**
 * Bagian halaman yang sedang dilihat: id terakhir (urut dokumen) yang tepi atasnya sudah melewati
 * garis `line` (fraksi tinggi layar dari atas). Null bila belum ada yang melewati garis.
 * Dipakai bilah hasil kalkulator multi-bagian agar ringkasan mengikuti bagian aktif.
 */
export function useActiveSection(ids: readonly string[], line = 0.45): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scroller = document.getElementById('main-scrollable-viewport');
    let frame = 0;
    const update = () => {
      frame = 0;
      const limit = window.innerHeight * line;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= limit) current = id;
      }
      setActive(prev => (prev === current ? prev : current));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    (scroller ?? window).addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      (scroller ?? window).removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, line]);

  return active;
}
