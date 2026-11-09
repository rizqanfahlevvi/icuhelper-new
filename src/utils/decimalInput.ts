/**
 * Normalisasi teks input angka: menerima koma desimal (kebiasaan Indonesia, "1,5")
 * dan mengubahnya ke titik ("1.5") agar parseFloat di kalkulator tetap benar.
 * Karakter non-angka dibuang; hanya satu pemisah desimal & tanda minus di depan.
 */
export function normalizeDecimalInput(raw: string, allowNegative = true): string {
  let s = raw.replace(/\s/g, '').replace(/,/g, '.');
  const neg = allowNegative && s.startsWith('-');
  s = s.replace(/[^0-9.]/g, '');
  const dot = s.indexOf('.');
  if (dot !== -1) s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '');
  return (neg ? '-' : '') + s;
}
