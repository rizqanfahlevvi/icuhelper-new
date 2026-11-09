import { Fragment, useMemo } from 'react';
import { Accordion } from './Accordion';
import { abbrLabel, abbrMeaning, type AbbrKey } from '../../utils/abbreviations';

interface AbbrLegendProps {
  /** Singkatan yang muncul di halaman ini (urutan bebas; duplikat diabaikan). */
  terms: readonly AbbrKey[];
  title?: string;
  defaultOpen?: boolean;
}

/** Daftar "Keterangan Singkatan" per halaman — kamus terpusat di `utils/abbreviations`. */
export function AbbrLegend({ terms, title = '🔤 Keterangan Singkatan', defaultOpen = false }: AbbrLegendProps) {
  const rows = useMemo(
    () =>
      [...new Set(terms)]
        .map((key) => ({ key, label: abbrLabel(key), meaning: abbrMeaning(key) }))
        .sort((a, b) => a.label.localeCompare(b.label, 'id', { sensitivity: 'base' }) || a.key.localeCompare(b.key)),
    [terms],
  );
  if (rows.length === 0) return null;
  return (
    <Accordion title={`${title} (${rows.length})`} defaultOpen={defaultOpen}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[12px]">
        {rows.map((r) => (
          <Fragment key={r.key}>
            <dt className="font-bold text-foreground whitespace-nowrap">{r.label}</dt>
            <dd className="text-muted-foreground min-w-0 break-words">{r.meaning}</dd>
          </Fragment>
        ))}
      </dl>
    </Accordion>
  );
}
