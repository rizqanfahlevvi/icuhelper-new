import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronRight, User, Pill, Droplets, BookMarked, Type, LayoutGrid, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatientStore } from '../../store/usePatientStore';
import { prepareEntries, searchEntries, type SearchEntry, type SearchKind } from '../../utils/searchIndex';
import { buildPageEntries, buildPatientEntries } from '../../utils/searchPages';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

const KIND_ICON: Record<SearchKind, React.ComponentType<{ className?: string }>> = {
  halaman: LayoutGrid,
  pasien: User,
  obat: Pill,
  cairan: Droplets,
  singkatan: Type,
  referensi: BookMarked,
};

/** Tujuan "Lihat semua" per jenis hasil (kueri ikut dibawa). */
function seeAllPath(kind: SearchKind, q: string): string | null {
  const enc = encodeURIComponent(q.trim());
  if (kind === 'obat') return `/pharmacy?tab=obat&q=${enc}`;
  if (kind === 'cairan') return `/pharmacy?tab=cairan&q=${enc}`;
  if (kind === 'referensi' || kind === 'singkatan') return `/reference?q=${enc}`;
  return null;
}

const PAGE_ENTRIES = buildPageEntries();

export default function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [heavy, setHeavy] = useState<SearchEntry[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const patients = usePatientStore((s) => s.patients);
  const activePatientId = usePatientStore((s) => s.activePatientId);
  const setActivePatient = usePatientStore((s) => s.setActivePatient);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setCursor(0);
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    // Data obat/cairan/referensi/singkatan dimuat dinamis saat pencarian pertama kali dibuka.
    if (!heavy) {
      import('../../utils/searchIndexHeavy')
        .then((m) => setHeavy(m.buildHeavyEntries()))
        .catch(() => setLoadError(true));
    }
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => { clearTimeout(t); document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen, onClose, heavy]);

  const prepared = useMemo(
    () => prepareEntries([...buildPatientEntries(patients, activePatientId), ...PAGE_ENTRIES, ...(heavy ?? [])]),
    [patients, activePatientId, heavy],
  );
  const groups = useMemo(() => searchEntries(prepared, query), [prepared, query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => { setCursor(0); }, [query]);

  const choose = (entry: SearchEntry) => {
    if (entry.kind === 'pasien') {
      setActivePatient(entry.id);
      onSelect('/patients');
    } else if (entry.path) {
      onSelect(entry.path);
    }
    onClose();
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!flat.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, flat.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(flat[cursor]); }
  };

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-flat-index="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const q = query.trim();
  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col sm:p-4" data-global-search>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm sm:rounded-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian"
            className="relative w-full max-w-2xl mx-auto flex flex-col bg-[var(--bg-elevated)] sm:rounded-2xl shadow-2xl overflow-hidden max-h-full sm:max-h-[80vh]"
          >
            {/* Search Header */}
            <div className="flex items-center p-3 border-b border-[var(--separator)] gap-2 bg-[var(--bg-secondary)]" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
              <Search className="w-5 h-5 text-[var(--label-secondary)] ml-2 shrink-0" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                enterKeyHint="go"
                autoComplete="off"
                aria-label="Cari"
                placeholder="Cari alat, obat, singkatan, referensi, pasien…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-[16px] text-[var(--label-primary)] placeholder:text-[var(--label-tertiary)] h-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  aria-label="Hapus kueri"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--fill-secondary)] text-[var(--label-secondary)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-3 min-h-[40px] text-sm font-medium text-[var(--label-secondary)] hover:text-[var(--label-primary)] sm:hidden shrink-0"
              >
                Batal
              </button>
            </div>

            {/* Results Area */}
            <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain">
              {q === '' ? (
                <div className="p-8 text-center text-[var(--label-secondary)]">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" aria-hidden />
                  <p className="text-sm">Ketik untuk mencari kalkulator, skoring, teori, obat, cairan, singkatan, referensi, atau pasien.</p>
                  <p className="text-[12px] mt-2 text-[var(--label-tertiary)]">Contoh: norepinefrin, kalium, ARDS, PEEP, sepsis</p>
                </div>
              ) : groups.length > 0 ? (
                <div className="py-1">
                  {groups.map((g) => {
                    const more = g.total > g.items.length ? seeAllPath(g.kind, q) : null;
                    return (
                      <section key={g.kind} data-search-group={g.kind} aria-label={g.label} className="py-1">
                        <h3 className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--label-secondary)]">
                          {g.label} <span className="font-medium normal-case tracking-normal">({g.total})</span>
                        </h3>
                        {g.items.map((item) => {
                          flatIndex += 1;
                          const idx = flatIndex;
                          const Icon = KIND_ICON[item.kind];
                          const active = idx === cursor;
                          return (
                            <button
                              type="button"
                              key={`${item.kind}-${item.id}`}
                              data-search-item={item.title}
                              data-flat-index={idx}
                              onClick={() => choose(item)}
                              onMouseEnter={() => setCursor(idx)}
                              className={`w-full flex items-center gap-3 px-3 py-2 min-h-[52px] text-left transition-colors ${active ? 'bg-[var(--fill-secondary)]' : 'hover:bg-[var(--fill-secondary)]'}`}
                            >
                              <span className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                                <Icon className="w-[18px] h-[18px]" />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="flex items-center gap-2 min-w-0">
                                  <span className="text-[15px] font-semibold text-[var(--label-primary)] truncate">{item.title}</span>
                                  {item.badge && (
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 max-w-[45%] truncate ${item.badge === 'Aktif' ? 'bg-[var(--sys-green)]/15 text-[var(--sys-green)]' : item.badge === 'High alert' ? 'bg-[var(--sys-red)]/12 text-[var(--sys-red)]' : 'bg-[var(--fill-tertiary)] text-[var(--label-secondary)]'}`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </span>
                                {item.subtitle && (
                                  <span className={`block text-xs text-[var(--label-secondary)] mt-0.5 ${item.kind === 'singkatan' ? 'line-clamp-2' : 'truncate'}`}>
                                    {item.subtitle}
                                  </span>
                                )}
                              </span>
                              <ChevronRight className="w-4 h-4 text-[var(--label-tertiary)] shrink-0" aria-hidden />
                            </button>
                          );
                        })}
                        {more && (
                          <button
                            type="button"
                            onClick={() => { onSelect(more); onClose(); }}
                            className="w-full px-4 min-h-[40px] text-left text-[13px] font-semibold text-[var(--accent)] hover:bg-[var(--fill-secondary)]"
                          >
                            Lihat semua {g.total} {g.label.toLowerCase()} →
                          </button>
                        )}
                      </section>
                    );
                  })}
                  {!heavy && !loadError && (
                    <p className="px-4 py-2 text-[12px] text-[var(--label-tertiary)] flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> Memuat obat, cairan & referensi…
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-[var(--label-secondary)]">
                  {!heavy && !loadError ? (
                    <p className="text-sm flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Memuat indeks…</p>
                  ) : (
                    <p className="text-sm">Tidak ditemukan hasil untuk "{q}"</p>
                  )}
                </div>
              )}
            </div>

            {/* Keyboard shortcut hint (desktop only) */}
            <div className="hidden sm:flex items-center justify-center p-2 border-t border-[var(--separator)] bg-[var(--bg-secondary)] gap-4">
              <span className="text-[11px] text-[var(--label-tertiary)] flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--fill-tertiary)] rounded text-[10px] font-mono border border-[var(--separator)]">Ctrl/⌘ K</kbd>
                <span>buka</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-[var(--fill-tertiary)] rounded text-[10px] font-mono border border-[var(--separator)]">↑ ↓</kbd>
                <span>pilih</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-[var(--fill-tertiary)] rounded text-[10px] font-mono border border-[var(--separator)]">Enter</kbd>
                <span>buka hasil</span>
              </span>
              <span className="text-[11px] text-[var(--label-tertiary)]">ESC menutup</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
