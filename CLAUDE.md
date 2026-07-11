# ICU Helper — Panduan untuk Claude

PWA pendukung keputusan bedside untuk dokter IGD/ICU Indonesia. Semua teks UI **Bahasa Indonesia**.

## Perintah
- `npm run dev` — server dev (Express + Vite)
- `npm run typecheck` — `tsc --noEmit`
- `npm test` — Vitest (`vitest run`)
- `npm run build` — build produksi
- `npm run lint` — ESLint

**Gerbang mutu (WAJIB sebelum commit):** `npm run typecheck && npm test && npm run build` harus lolos.

## Stack
React 19 (route lazy-loaded) · Vite 6 · Tailwind CSS v4 (via `@tailwindcss/vite`) · Firebase 12 (Auth + Firestore) · Zustand 5 · TypeScript strict · Vitest.

## Sistem tema & warna (SERING SALAH — baca ini)
- Token iOS yang VALID: `var(--sys-blue)`, `var(--sys-green)`, `var(--sys-orange)`, `var(--sys-red)`, `var(--accent)`. Token `var(--blue)`/`var(--green)`/`var(--amber)`/`var(--red)` **TIDAK ADA**.
- Tailwind semantik: `text-destructive` **ADA**; `text-warning` **TIDAK ADA** (pakai `text-amber-600 dark:text-amber-400`).
- **Jangan** hardcode warna hex/rgb. Pakai token CSS atau kelas Tailwind semantik.
- Mendukung light/dark. Ukuran teks `text-[Npx]` & bobot `font-*` otomatis skala dari Pengaturan (override di `src/index.css`) — jangan tambah override px baru tanpa mendaftarkannya di sana.

## State (Zustand)
- `usePatientStore` — `weightKg`, `heightCm`, `gender` (`''`/`'L'`/`'P'`), daftar `patients`, `activePatientId`. Persist ke IndexedDB.
- `useClinicalStore` — `data.na`, `data.cl`, `data.hco3`, `data.albumin`, `data.k`, `data.glukosa`, `data.ph`, `data.rr`, `data.peep`, `data.spo2`, `data.pao2`, dll. Persist ke localStorage.
- `useSettingsStore` — font, tema, haptics. `useHistoryStore` — riwayat kalkulasi (maks 30).
- Catatan gender: patient store pakai `'L'/'P'`; sebagian kalkulator pakai `'m'/'f'` secara lokal — konversi eksplisit.

## Pola standar kalkulator (ikuti saat menambah/mengubah)
1. `<ActivePatientBriefCard onAutofill={...} />` — props: `onAutofill`, `title` (opsional). **Bukan** `patientName`.
2. `<UnifiedSyncBanner fields={syncFields} />` — sinkron nilai lab dari clinical store.
3. Auto-load nilai dari store di `useEffect(..., [])` saat mount.
4. **`<CalcSteps>`** (`src/components/ui/CalcSteps.tsx`) — WAJIB untuk setiap hasil yang menghasilkan angka: tiap langkah = rumus + **substitusi angka pasien** + hasil + catatan. Untuk skoring: rincian kontribusi poin per parameter.
5. `<SaveToHistoryButton module=... label=... inputs=... summary=... />`.
6. `<Accordion title="📖 Teori & Referensi ...">` dengan sitasi.
7. Kalkulator penghasil dosis: sertakan disclaimer "alat bantu edukasi & referensi cepat — bukan pengganti penilaian klinis atau keputusan DPJP".
- Util antropometri: `src/utils/anthropometry.ts` (`calcIbw`, `calcBmi`, `calcBsa`, `calcLbw`, `calcAdjBw`) — jangan tulis ulang rumus IBW/BMI di komponen.

## Aturan klinis (KESELAMATAN)
- **Jangan mengarang** nilai/ambang/faktor klinis. Verifikasi ke referensi reliable (guideline resmi > NEJM/JAMA > UpToDate) dan **sebutkan sumbernya**.
- Verifikasi rumus dengan **hitung manual** + edge case (bagi nol, satuan, klamp). Kalau salah, perbaiki sampai lolos.
- **Jangan diam-diam mengubah** angka dosis/skor yang dilihat dokter. Kalau ada >1 rumus sah dengan hasil berbeda bermakna → lapor & tanya (atau tampilkan sebagai rentang, seperti Natrium: metode defisit + Adrogué–Madías).
- Waspada khusus **laju per-jam vs per-24-jam** (rawan salah label, berbahaya).

## Alur kerja & git
- Kerjakan per fase kecil; `typecheck + test + build` lalu commit deskriptif tiap fase.
- Preferensi pemilik: setelah push ke branch kerja, **fast-forward merge ke `main` dan push** (`git checkout main && git merge --ff-only <branch> && git push origin main`).
- Untuk perbaikan rumus, catat di pesan commit: rumus lama, rumus benar, referensi, contoh hitung manual.

## Keamanan (konteks)
- Firebase `apiKey` di `src/lib/firebase.ts` memang publik & aman — keamanan sesungguhnya ada di **Firestore Security Rules** (dikelola di Console, bukan di repo).
- `/api/daily-news` butuh Firebase ID token + cache server (lihat `api/_lib/`). `GEMINI_API_KEY` hanya di server.
- Logout menghapus data pasien lokal (`src/utils/logout.ts`).
