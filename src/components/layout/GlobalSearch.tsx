import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { ALL_FAVORITABLE_ITEMS, FavoritableItem } from '../../data/favoritableItems';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

export default function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FavoritableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      // Small delay to allow animation to start before focusing
      setTimeout(() => inputRef.current?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = ALL_FAVORITABLE_ITEMS.filter(
      item => 
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.desc.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery)
    );
    
    setResults(filtered);
  }, [query]);

  const handleSelect = (path: string) => {
    onSelect(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col sm:p-4">
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
            className="relative w-full max-w-2xl mx-auto flex flex-col bg-[var(--bg-elevated)] sm:rounded-2xl shadow-2xl overflow-hidden max-h-full sm:max-h-[80vh]"
          >
            {/* Search Header */}
            <div className="flex items-center p-3 border-b border-[var(--separator)] gap-3 bg-[var(--bg-secondary)]">
              <Search className="w-5 h-5 text-[var(--label-secondary)] ml-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Cari kalkulator, skoring, teori..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[16px] text-[var(--label-primary)] placeholder:text-[var(--label-tertiary)] h-10"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full hover:bg-[var(--fill-secondary)] text-[var(--label-secondary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm font-medium text-[var(--label-secondary)] hover:text-[var(--label-primary)] sm:hidden"
              >
                Batal
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {query.trim() === '' ? (
                <div className="p-8 text-center text-[var(--label-secondary)]">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Ketik untuk mencari alat klinis, referensi, atau teori</p>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-[var(--fill-secondary)] transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[15px] font-semibold text-[var(--label-primary)] truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--fill-tertiary)] text-[var(--label-secondary)] shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--label-secondary)] truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--label-tertiary)] shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-[var(--label-secondary)]">
                  <p className="text-sm">Tidak ditemukan hasil untuk "{query}"</p>
                </div>
              )}
            </div>
            
            {/* Keyboard shortcut hint (desktop only) */}
            <div className="hidden sm:flex items-center justify-center p-2 border-t border-[var(--separator)] bg-[var(--bg-secondary)] gap-4">
              <span className="text-[11px] text-[var(--label-tertiary)] flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--fill-tertiary)] rounded text-[10px] font-mono border border-[var(--separator)]">Cmd</kbd>
                <span>/</span>
                <kbd className="px-1.5 py-0.5 bg-[var(--fill-tertiary)] rounded text-[10px] font-mono border border-[var(--separator)]">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-[var(--fill-tertiary)] rounded text-[10px] font-mono border border-[var(--separator)]">K</kbd>
                <span className="ml-1">untuk membuka pencarian</span>
              </span>
              <span className="text-[11px] text-[var(--label-tertiary)]">Tekan ESC untuk menutup</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
