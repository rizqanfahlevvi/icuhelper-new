import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, X } from 'lucide-react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import type { FavoritableItem, ToolGroup } from '../data/favoritableItems';
import { expandQuery, normalizeSearch } from '../utils/searchIndex';

interface ToolIndexProps {
  items: FavoritableItem[];
  groups: { id: ToolGroup; label: string }[];
  placeholder: string;
}

/** Cocokkan alat dengan kueri (nama/deskripsi/kelompok), termasuk sinonim umum. */
function matches(item: FavoritableItem, groupLabel: string, terms: string[]): boolean {
  if (!terms.length) return true;
  const hay = ' ' + normalizeSearch(`${item.name} ${item.fullName ?? ''} ${item.desc} ${groupLabel}`) + ' ';
  return terms.some((t) => (t.length <= 2 ? hay.includes(` ${t} `) : hay.includes(t)));
}

/**
 * Daftar alat ringkas berkelompok per sistem organ, dengan kolom cari & bintang favorit.
 * Dipakai oleh indeks Kalkulator dan Skoring.
 */
export function ToolIndex({ items, groups, placeholder }: ToolIndexProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [q, setQ] = useState('');
  const terms = useMemo(() => expandQuery(q), [q]);

  const sections = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, items: items.filter((it) => (it.group ?? 'lainnya') === g.id && matches(it, g.label, terms)) }))
        .filter((g) => g.items.length > 0),
    [groups, items, terms],
  );
  const total = sections.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--label-tertiary)]" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full h-11 pl-9 pr-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--separator)] text-[15px] text-[var(--label-primary)] placeholder:text-[var(--label-tertiary)] outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            aria-label="Hapus pencarian"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {total === 0 && (
        <p className="text-center text-[13px] text-[var(--label-secondary)] py-6">Tidak ada alat yang cocok dengan “{q}”.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
        {sections.map((g) => (
          <section key={g.id} aria-labelledby={`grp-${g.id}`}>
            <h2 id={`grp-${g.id}`} className="px-1 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--label-secondary)]">
              {g.label}
            </h2>
            <ul className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--separator)] divide-y divide-[var(--separator)] overflow-hidden">
              {g.items.map((it) => {
                const fav = isFavorite(it.path);
                const Icon = it.icon;
                return (
                  <li key={it.path} className="flex items-stretch">
                    <Link
                      to={it.path}
                      className="flex-1 min-w-0 flex items-center gap-3 pl-3 pr-1 py-1.5 min-h-[48px] hover:bg-[var(--fill-secondary)] active:bg-[var(--fill-secondary)] transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] leading-snug font-semibold text-[var(--label-primary)] truncate">{it.name}</span>
                        <span className="block text-[12px] leading-snug text-[var(--label-secondary)] truncate">{it.desc}</span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(it.path)}
                      aria-pressed={fav}
                      aria-label={fav ? `Hapus ${it.name} dari favorit` : `Sematkan ${it.name} ke favorit`}
                      className="w-11 shrink-0 flex items-center justify-center hover:bg-[var(--fill-secondary)]"
                    >
                      <Star className={`w-4 h-4 ${fav ? 'text-[var(--sys-orange)] fill-[var(--sys-orange)]' : 'text-[var(--label-tertiary)]'}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
