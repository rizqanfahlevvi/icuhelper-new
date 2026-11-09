import React, { forwardRef } from 'react';
import { normalizeDecimalInput } from '../../utils/decimalInput';

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Izinkan nilai negatif (default true — sama dengan perilaku input type=number sebelumnya). */
  allowNegative?: boolean;
};

/**
 * Pengganti `<input type="number">` yang ramah ponsel Indonesia:
 * - menerima koma desimal ("1,5" → "1.5"), keyboard desimal (inputMode="decimal");
 * - tombol Enter/"Next" berpindah ke input berikutnya;
 * - tidak berubah nilai saat roda mouse/trackpad digulir.
 * onChange tetap menerima event biasa; e.target.value sudah dinormalisasi (titik).
 */
export const DecimalInput = forwardRef<HTMLInputElement, Props>(function DecimalInput(
  { allowNegative = true, onChange, onKeyDown, inputMode, enterKeyHint, autoComplete, ...rest },
  ref,
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const norm = normalizeDecimalInput(e.target.value, allowNegative);
    if (norm !== e.target.value) e.target.value = norm;
    onChange?.(e);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.key !== 'Enter') return;
    const fields = Array.from(document.querySelectorAll<HTMLElement>('input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled])'))
      .filter((el) => el.offsetParent !== null);
    const idx = fields.indexOf(e.currentTarget);
    const next = idx >= 0 ? fields[idx + 1] : undefined;
    if (next) { e.preventDefault(); next.focus(); }
    else e.currentTarget.blur();
  };
  return (
    <input
      ref={ref}
      type="text"
      inputMode={inputMode ?? 'decimal'}
      enterKeyHint={enterKeyHint ?? 'next'}
      autoComplete={autoComplete ?? 'off'}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
});
