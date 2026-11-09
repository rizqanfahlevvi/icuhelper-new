/** Satu entri kamus singkatan. */
export interface AbbrEntry {
  /** Kepanjangan resmi (biasanya bahasa Inggris atau istilah asli). */
  full: string;
  /** Arti/padanan Bahasa Indonesia (opsional bila `full` sudah Bahasa Indonesia). */
  id?: string;
  /**
   * Teks singkatan yang ditampilkan bila berbeda dari kunci — untuk homonim,
   * mis. kunci `VT-aritmia` ditampilkan sebagai "VT".
   */
  label?: string;
}

export type AbbrDict = Record<string, AbbrEntry>;
