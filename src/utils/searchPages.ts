import { ALL_FAVORITABLE_ITEMS, CALC_GROUPS, SCORING_GROUPS } from '../data/favoritableItems';
import type { Patient } from '../store/usePatientStore';
import type { SearchEntry } from './searchIndex';

/** Halaman non-alat yang juga bisa dicari (menu utama). */
const NAV_PAGES: SearchEntry[] = [
  { kind: 'halaman', id: '/', title: 'Home', path: '/', badge: 'Menu', subtitle: 'Beranda: pasien aktif, favorit, modul klinis', keywords: 'beranda dashboard' },
  { kind: 'halaman', id: '/patients', title: 'Data Pasien', path: '/patients', badge: 'Menu', subtitle: 'Daftar pasien, tambah/aktifkan pasien, lengkapi data klinis', keywords: 'pasien baru database lengkapi data' },
  { kind: 'halaman', id: '/calculator', title: 'Semua Kalkulator', path: '/calculator', badge: 'Menu', subtitle: 'Indeks kalkulator per sistem organ', keywords: 'alat hitung' },
  { kind: 'halaman', id: '/scoring', title: 'Semua Skoring', path: '/scoring', badge: 'Menu', subtitle: 'Indeks sistem skoring klinis', keywords: 'skor score' },
  { kind: 'halaman', id: '/theory', title: 'Teori Klinis', path: '/theory', badge: 'Menu', subtitle: 'Indeks materi teori ICU', keywords: 'belajar materi edukasi' },
  { kind: 'halaman', id: '/setting', title: 'Protokol ICU', path: '/setting', badge: 'Menu', subtitle: 'Protokol & bundle perawatan ICU', keywords: 'protokol bundle sop' },
  { kind: 'halaman', id: '/riwayat', title: 'Riwayat Perhitungan', path: '/riwayat', badge: 'Menu', subtitle: 'Hasil kalkulasi yang disimpan', keywords: 'history riwayat simpan' },
  { kind: 'halaman', id: '/settings', title: 'Pengaturan', path: '/settings', badge: 'Menu', subtitle: 'Ukuran & ketebalan font, tema gelap, mode baca', keywords: 'setting font tema dark mode tampilan' },
  { kind: 'halaman', id: '/about', title: 'Tentang Aplikasi', path: '/about', badge: 'Menu', subtitle: 'Informasi ICU Helper & disclaimer', keywords: 'about tentang' },
];

const GROUP_LABEL: Record<string, string> = Object.fromEntries(
  [...CALC_GROUPS, ...SCORING_GROUPS].map((g) => [g.id, g.label]),
);

/** Entri halaman: semua alat (kalkulator, skoring, teori, referensi) + menu utama. */
export function buildPageEntries(): SearchEntry[] {
  const tools: SearchEntry[] = ALL_FAVORITABLE_ITEMS.map((it) => ({
    kind: 'halaman',
    id: it.path,
    title: it.name,
    subtitle: it.desc,
    badge: it.category,
    path: it.path,
    keywords: [it.fullName, it.group ? GROUP_LABEL[it.group] : ''].filter(Boolean).join(' '),
  }));
  const known = new Set(tools.map((t) => t.id));
  return [...tools, ...NAV_PAGES.filter((p) => !known.has(p.id))];
}

/** Entri pasien tersimpan (nama · usia · JK · BB). */
export function buildPatientEntries(patients: Patient[], activeId: string | null): SearchEntry[] {
  return patients.map((p) => {
    const bits = [p.agePrecise || (p.ageYears ? `${p.ageYears} thn` : ''), p.gender, p.weightKg ? `${p.weightKg} kg` : ''].filter(Boolean);
    return {
      kind: 'pasien',
      id: p.id,
      title: p.nama || 'Pasien tanpa nama',
      subtitle: bits.join(' · ') || undefined,
      badge: p.id === activeId ? 'Aktif' : 'Tersimpan',
      keywords: p.category,
    };
  });
}
