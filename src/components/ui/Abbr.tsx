import { useState, type ReactNode } from 'react';
import { abbrLabel, abbrMeaning, type AbbrKey } from '../../utils/abbreviations';

/**
 * Singkatan yang bisa diketuk untuk melihat kepanjangannya (di ponsel tidak ada hover).
 * Desktop juga mendapat tooltip bawaan lewat atribut `title`.
 */
export function Abbr({ k, children }: { k: AbbrKey; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const meaning = abbrMeaning(k);
  return (
    <abbr title={meaning} className="no-underline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${abbrLabel(k)}: ${meaning}`}
        className="underline decoration-dotted underline-offset-2 cursor-help"
      >
        {children ?? abbrLabel(k)}
      </button>
      {open && <span className="font-normal text-muted-foreground"> ({meaning})</span>}
    </abbr>
  );
}
