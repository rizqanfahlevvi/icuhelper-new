import { AlertTriangle } from 'lucide-react';

/**
 * Peringatan input NON-BLOCKING (amber). Render null bila message kosong.
 * Dipakai untuk plausibilitas berat/nilai lab agar salah ketik/satuan terdeteksi
 * tanpa menghentikan perhitungan. Terima satu pesan atau daftar pesan.
 */
export function InputWarning({ message, messages }: { message?: string | null; messages?: (string | null)[] }) {
  const list = (messages ?? [message]).filter((m): m is string => !!m);
  if (list.length === 0) return null;
  return (
    <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/60 text-[12px] text-amber-800 dark:text-amber-300 space-y-1">
      {list.map((m, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{m}</span>
        </div>
      ))}
    </div>
  );
}
