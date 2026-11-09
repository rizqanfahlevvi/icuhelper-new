import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, CloudCheck, AlertTriangle, ChevronDown } from 'lucide-react';
import { useClinicalStore, type ClinicalData, type ClinicalKey } from '../store/useClinicalStore';
import { usePatientStore } from '../store/usePatientStore';
import { formatDataAge, formatDataTimestamp } from '../utils/patientContext';

export interface SyncField {
  key: ClinicalKey;
  label: string;
  /**
   * Nilai lokal dalam SATUAN KANONIK store (lihat utils/clinicalVariables.ts).
   * Kirim '' bila nilai lokal tidak boleh/tidak bisa dipublikasikan
   * (mis. sampel vena untuk kunci gas darah arteri).
   */
  value: string;
  /**
   * Nilai mentah seperti yang diketik (satuan tampilan). Wajib diisi bila `value`
   * hasil konversi satuan: publish hanya terjadi bila nilai MENTAH berubah, sehingga
   * mengganti pilihan satuan tidak pernah mengirim angka yang ditafsir ulang.
   */
  rawValue?: string;
  /** Terima nilai store (satuan kanonik) → set state lokal; konversi satuan di sini. */
  setter: (val: string) => void;
  unit?: string;
  formatDisplay?: (val: string) => string;
  /**
   * true = hanya IMPOR dari data pasien; nilai lokal tidak pernah ditulis balik.
   * Untuk nilai kondisi-uji yang bukan kondisi pasien sehari-hari (mis. RR saat SBT).
   */
  importOnly?: boolean;
}

interface UnifiedSyncBannerProps {
  fields: SyncField[];
}

/**
 * Sinkronisasi dua arah kalkulator ↔ data pasien:
 * - PUBLISH: hanya nilai yang BERUBAH di kalkulator (diketik/diimpor pengguna) yang
 *   ditulis ke store → otomatis tersimpan ke pasien aktif (store/patientContextSync).
 *   Perubahan store (ganti/tutup pasien) tidak pernah memicu publish ulang nilai lama.
 * - IMPORT: bila store punya nilai berbeda, tampilkan banner konfirmasi
 *   "Gunakan Data Pasien" lengkap dengan umur data per variabel.
 */
export function UnifiedSyncBanner({ fields }: UnifiedSyncBannerProps) {
  const storeData = useClinicalStore((s) => s.data);
  const updatedAt = useClinicalStore((s) => s.updatedAt);
  const ownerId = useClinicalStore((s) => s.ownerId);
  const setFields = useClinicalStore((s) => s.setFields);
  const patientName = usePatientStore((s) => s.nama);
  const activePatientId = usePatientStore((s) => s.activePatientId);

  const [dismissedFor, setDismissedFor] = useState<string | null | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);
  const ownerAtMountRef = useRef<string | null>(ownerId);
  const prevLocalRef = useRef<Record<string, string>>({});

  // Publish perubahan lokal → store (bukan perubahan store → lokal).
  useEffect(() => {
    const updates: Partial<Record<ClinicalKey, string>> = {};
    let hasUpdates = false;
    const occurrence: Record<string, number> = {};
    for (const field of fields) {
      const cur = field.value || '';
      // Deteksi perubahan memakai nilai mentah (bila ada) → ganti satuan ≠ input baru.
      const raw = field.rawValue ?? cur;
      // Kunci yang sama bisa muncul >1 kali (mis. ureum di dua bagian) → lacak per kemunculan.
      const n = (occurrence[field.key] = (occurrence[field.key] ?? -1) + 1);
      const slot = `${field.key}#${n}`;
      const prev = prevLocalRef.current[slot];
      prevLocalRef.current[slot] = raw;
      if (prev === undefined || prev === raw || field.importOnly) continue; // observasi pertama / tidak berubah / impor saja
      if (cur !== '' && cur !== (useClinicalStore.getState().data[field.key] || '')) {
        updates[field.key] = cur;
        hasUpdates = true;
      }
    }
    if (hasUpdates) setFields(updates as Partial<ClinicalData>);
  }, [fields, setFields]);

  // Kolom yang bisa diimpor: store berisi & berbeda dari nilai lokal (dedup per kunci).
  const seen = new Set<string>();
  const syncableFields = fields.filter((field) => {
    const globalVal = storeData[field.key] || '';
    if (globalVal === '' || globalVal === (field.value || '')) return false;
    if (seen.has(field.key)) return false;
    seen.add(field.key);
    return true;
  });

  const handleApplyAll = () => {
    for (const field of fields) {
      const globalVal = storeData[field.key] || '';
      if (globalVal !== '' && globalVal !== field.value) {
        field.setter(globalVal);
        // Nilai mentah baru belum diketahui (hasil konversi setter) → tandai agar
        // render berikutnya hanya merekam, tidak mem-publish.
        for (const slot of Object.keys(prevLocalRef.current)) {
          if (slot.startsWith(`${field.key}#`)) delete prevLocalRef.current[slot];
        }
      }
    }
    ownerAtMountRef.current = ownerId;
  };

  const hasActivePatient = !!activePatientId && ownerId === activePatientId;
  const ownerChanged = ownerAtMountRef.current !== ownerId;
  const isDismissed = dismissedFor !== undefined && dismissedFor === ownerId;
  const showBanner = syncableFields.length > 0 && !isDismissed;
  const name = patientName || 'pasien aktif';

  if (!showBanner) {
    if (!hasActivePatient || fields.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 px-1">
        <CloudCheck className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">
          Tersinkron dengan data <strong className="font-bold">{name}</strong> — perubahan tersimpan otomatis.
        </span>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full overflow-hidden"
      >
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-sm relative">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="flex-shrink-0 p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
              {ownerChanged && hasActivePatient ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {hasActivePatient
                  ? ownerChanged
                    ? `Pasien aktif berganti → ${name}`
                    : `Data ${name} tersedia`
                  : 'Data sesi tersimpan'}
              </div>
              {/* Ringkas: satu baris nama variabel; rincian nilai + umur data dibuka bila perlu. */}
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="mt-0.5 flex items-center gap-1 text-xs text-amber-700/90 dark:text-amber-400/90 text-left max-w-full cursor-pointer"
              >
                <span className="truncate">
                  {ownerChanged && hasActivePatient ? 'Perbarui ' : 'Isi '}
                  {syncableFields.length} nilai: {syncableFields.map((f) => f.label).join(', ')}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
              <div className="text-xs text-amber-700/80 dark:text-amber-400/85 mt-1.5 flex flex-wrap gap-x-2 gap-y-1 items-center">
                {ownerChanged && hasActivePatient && (
                  <span>Nilai di kalkulator ini masih dari data sebelumnya.</span>
                )}
                {syncableFields.map((field) => {
                  const globalVal = storeData[field.key] || '';
                  const displayVal = field.formatDisplay
                    ? field.formatDisplay(globalVal)
                    : `${globalVal}${field.unit ? ` ${field.unit}` : ''}`;
                  const age = formatDataAge(updatedAt[field.key]);
                  return (
                    <span
                      key={field.key}
                      title={updatedAt[field.key] ? `Diperbarui ${formatDataTimestamp(updatedAt[field.key])}` : undefined}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 font-medium text-[11px]"
                    >
                      {field.label}: {displayVal}
                      {age && <span className="font-normal opacity-75">· {age}</span>}
                    </span>
                  );
                })}
              </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              onClick={handleApplyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-xl shadow-sm hover:bg-amber-500 transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" /> {hasActivePatient ? 'Gunakan Data Pasien' : 'Gunakan Data Sesi'}
            </button>
            <button
              onClick={() => setDismissedFor(ownerId)}
              className="p-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition-colors cursor-pointer"
              title="Abaikan"
              aria-label="Abaikan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
