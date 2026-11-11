import { Link, useNavigate } from "react-router-dom";
import {
  Calculator,
  Pill,
  Activity,
  BookOpen,
  ChevronRight,
  BarChart2,
  BookMarked,
  User,
  Plus,
  Star,
  Linkedin,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { usePatientStore } from "../store/usePatientStore";
import { useFavoritesStore } from "../store/useFavoritesStore";
import { useRecentToolsStore } from "../store/useRecentToolsStore";
import {
  ALL_FAVORITABLE_ITEMS,
  getFavoritableItemByPath,
} from "../data/favoritableItems";
import LogoIcon from "../components/ui/LogoIcon";
import { AbbrLegend } from '../components/ui/AbbrLegend';

type PillarCategory = 'Kalkulator' | 'Skoring' | 'Teori';

const countByCategory = (cat: PillarCategory) =>
  ALL_FAVORITABLE_ITEMS.filter((it) => it.category === cat).length;

const PILLARS: {
  path: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
  countCategory?: PillarCategory;
  unit?: string;
}[] = [
  { path: '/calculator', title: 'Kalkulator Medis', icon: Calculator, tint: 'var(--sys-teal)', countCategory: 'Kalkulator', unit: 'alat',
    desc: 'Cairan, elektrolit, P/F & ventilator, ginjal, insulin, nutrisi, transfusi, ABG.' },
  { path: '/scoring', title: 'Skoring Klinis', icon: BarChart2, tint: 'var(--sys-orange)', countCategory: 'Skoring', unit: 'skor',
    desc: 'SOFA, APACHE II, CAM-ICU, RASS, CPIS, Wells, dan lainnya.' },
  { path: '/pharmacy', title: 'Obat & Cairan', icon: Pill, tint: 'var(--sys-indigo)',
    desc: 'Dosis & laju infus, penyesuaian ginjal, interaksi obat, komposisi cairan IV.' },
  { path: '/theory', title: 'Teori Klinis', icon: BookOpen, tint: 'var(--sys-green)', countCategory: 'Teori', unit: 'topik',
    desc: 'Sepsis & syok, gagal napas, ventilator, SAT/SBT, AKI/CRRT, DKA/HHS, B1–B6.' },
  { path: '/reference', title: 'Referensi & Glosarium', icon: BookMarked, tint: 'var(--sys-blue)',
    desc: 'Literatur & guideline rujukan, plus glosarium singkatan.' },
];

export default function Home() {
  const navigate = useNavigate();
  const patient = usePatientStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const recentPaths = useRecentToolsStore((state) => state.recentPaths);

  const getHariPerawatan = (mrsDateString?: string) => {
    if (!mrsDateString) return null;
    const mrsDate = new Date(mrsDateString);
    mrsDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - mrsDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (isNaN(diffDays)) return null;
    return `Hari Ke-${diffDays}`;
  };

  const hasPatientData =
    patient.weightKg || patient.ageYears || patient.heightCm || patient.mrsDate;
  const favoriteItems = ALL_FAVORITABLE_ITEMS.filter((it) =>
    favorites.includes(it.path),
  );
  const recentItems = recentPaths
    .map((p) => getFavoritableItemByPath(p))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4 space-y-5 pb-6 overflow-x-hidden">
      {/* Hero identitas — nama app, tagline & pembuat tampil jelas (tetap ringkas tingginya
          agar kartu pasien aktif masih terlihat di layar pertama). */}
      <section
        aria-label="Tentang ICU Helper"
        className="relative overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--accent-tint)] via-[var(--bg-elevated)] to-[var(--bg-elevated)] p-5 shadow-sm"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--accent)] opacity-[0.08]" />
        <div className="relative flex items-center gap-3.5">
          <LogoIcon className="w-14 h-14 flex-shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-[var(--label-primary)]">
              ICU<span className="text-[var(--accent)]"> Helper</span>
            </h1>
            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--accent)]">
              Your Daily Emergency &amp; Intensive Companion
            </p>
          </div>
        </div>
        <p className="relative mt-3 text-[13px] leading-relaxed text-[var(--label-secondary)] max-w-md">
          Kalkulator klinis, skoring, dosis obat &amp; cairan, serta teori berbasis bukti — terhubung dengan data pasien Anda.
        </p>
        <a
          href="https://id.linkedin.com/in/rizqanfahlevvi/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dibuat oleh Rizqanfahlevvi — buka profil LinkedIn"
          className="relative mt-3.5 inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-elevated)] px-3 py-1.5 shadow-sm hover:bg-[var(--fill-secondary)] transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sys-blue)] text-white flex-shrink-0">
            <Linkedin className="w-3.5 h-3.5 fill-current" />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--label-secondary)]">Dibuat oleh</span>
            <span className="block text-[14px] font-bold text-[var(--label-primary)]">Rizqanfahlevvi</span>
          </span>
        </a>
      </section>

      {/* Patient Summary Card */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Status Pasien Aktif
          </span>
        </div>

        {!hasPatientData ? (
          <Link
            className="bg-card border border-border/80 w-full flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:border-slate-400 transition-colors block"
            to="/patients"
          >
            <span className="w-10 h-10 rounded-full bg-[var(--fill-secondary)] flex items-center justify-center text-[var(--label-tertiary)] flex-shrink-0 animate-pulse">
              <User size={18} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-[var(--label-primary)]">
                Data Pasien
              </p>
              <p className="text-xs text-[var(--label-secondary)] mt-0.5">
                Belum diisi — ketuk untuk mengelola database pasien
              </p>
            </div>
            <Plus size={18} className="text-[var(--accent)]" />
          </Link>
        ) : (
          <Link
            className="bg-card border border-border/80 w-full rounded-2xl shadow-sm hover:border-teal-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out block overflow-hidden group"
            to="/patients"
          >
            <div className="p-3.5 flex items-start gap-3 border-b border-border/40">
              <span className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0 border border-teal-500/20 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <User size={20} />
              </span>
              <div className="flex-1 mt-0.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-foreground line-clamp-1 pr-2">
                    {patient.nama || "Pasien Anonim"}
                  </p>
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400 px-1.5 py-0.5 rounded-md border border-teal-500/20 shadow-sm">
                    <Activity size={10} /> Aktif
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 font-medium">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                    <User size={10} /> {patient.gender || "-"}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/30">
                    <span className="capitalize">{patient.category || "-"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex bg-slate-50/50 dark:bg-slate-900/20 divide-x divide-border/40 font-mono">
              <div className="flex-1 p-2.5 text-center flex flex-col items-center justify-center">
                <div className="text-[9px] uppercase text-slate-500 font-bold font-sans tracking-wider mb-0.5">
                  Usia
                </div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200 flex items-baseline gap-0.5">
                  {patient.agePrecise
                    ? patient.agePrecise.replace(/\s*(thn|tahun|bln|bulan)\s*$/i, "")
                    : patient.ageYears || "-"}
                  <span className="text-[9px] text-slate-400 font-sans font-semibold">
                    {/bln|bulan/i.test(patient.agePrecise || "") ? "BLN" : "THN"}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-2.5 text-center flex flex-col items-center justify-center">
                <div className="text-[9px] uppercase text-slate-500 font-bold font-sans tracking-wider mb-0.5">
                  Berat
                </div>
                <div className="text-[13px] font-bold text-slate-700 dark:text-slate-200 flex items-baseline gap-0.5">
                  {patient.weightKg || "-"}
                  <span className="text-[9px] text-slate-400 font-sans font-semibold">
                    KG
                  </span>
                </div>
              </div>
              <div className="flex-1 p-2.5 text-center flex flex-col items-center justify-center bg-blue-50/40 dark:bg-blue-900/10">
                <div className="text-[9px] uppercase text-blue-600 dark:text-blue-400 font-bold font-sans tracking-wider mb-0.5 flex items-center gap-1">
                  <Clock size={9} /> Rawat Inap
                </div>
                <div className="text-[13px] font-extrabold text-blue-700 dark:text-blue-400">
                  {patient.mrsDate
                    ? (
                        getHariPerawatan(patient.mrsDate) || "Hari Ke-1"
                      ).replace("Hari Ke-", "H-")
                    : "-"}
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Pinned / Recent Tools Section */}
      {recentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="ios-section" style={{ padding: 0 }}>
              <span className="label flex items-center gap-1.5 font-bold text-blue-500">
                <Clock className="w-4 h-4 text-blue-500" />
                Terakhir Diakses
              </span>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x">
            {recentItems.map((item, index) => {
              if (!item) return null;
              const Icon = item.icon || Activity;
              return (
                <Link
                  key={item.path + index}
                  to={item.path}
                  className="flex-shrink-0 w-[140px] snap-start bg-card border border-border/80 rounded-xl p-3 shadow-sm hover:border-blue-500/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer"
                >
                  <div className="space-y-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-[12px] text-foreground tracking-tight line-clamp-2">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Favorit Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="ios-section" style={{ padding: 0 }}>
            <span className="label flex items-center gap-1.5 font-bold">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Akses Cepat Favorit
            </span>
          </div>
          {favoriteItems.length > 0 && (
            <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium">
              {favoriteItems.length} Tersemat
            </span>
          )}
        </div>

        {favoriteItems.length === 0 ? (
          <div className="border border-dashed border-border rounded-2xl p-5 text-center space-y-2 bg-muted/10">
            <Star className="w-7 h-7 text-muted-foreground/30 mx-auto" />
            <p className="text-xs font-semibold text-foreground/90">
              Belum Ada Menu Favorit
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-md mx-auto">
              Sematkan kalkulator, skoring klinis, atau referensi obat yang
              sering digunakan dengan mengetuk bintang{" "}
              <span className="text-amber-500 font-bold">★</span> di halaman
              detail atau daftar sub-menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {favoriteItems.map((item) => {
              const Icon = item.icon || Activity;
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="group relative bg-card border border-border/80 rounded-xl p-3 shadow-sm hover:border-amber-500/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col justify-between min-h-[95px] cursor-pointer"
                >
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.path);
                      }}
                      className="p-1 hover:bg-muted rounded-full transition-colors relative z-10"
                      title="Hapus dari Favorit"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <span className="w-7 h-7 rounded-lg bg-primary/5 text-primary flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <div>
                      <span className="text-[9px] font-bold text-muted-foreground/80 tracking-wider uppercase">
                        {item.category}
                      </span>
                      <h4 className="font-extrabold text-[12px] text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pilar modul klinis — angka dihitung otomatis dari daftar menu */}
      <div className="space-y-3">
        <div className="ios-section" style={{ padding: "0 4px" }}>
          <span className="label">Modul Klinis</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PILLARS.map((pl) => {
            const Icon = pl.icon;
            const n = pl.countCategory ? countByCategory(pl.countCategory) : null;
            return (
              <Link
                key={pl.path}
                to={pl.path}
                className="group p-4 bg-card border border-border/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-start gap-3"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ color: pl.tint, backgroundColor: `color-mix(in srgb, ${pl.tint} 12%, transparent)` }}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-extrabold text-foreground truncate">{pl.title}</h3>
                    {n !== null && (
                      <span className="text-[10.5px] font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full flex-shrink-0">
                        {n} {pl.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-snug">{pl.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--label-tertiary)] flex-shrink-0 self-center" />
              </Link>
            );
          })}
        </div>
      </div>

      <AbbrLegend
        terms={[
          'ICU', 'MRS', 'THN', 'BLN', 'P/F', 'ABG', 'APACHE', 'SOFA', 'CAM-ICU', 'RASS',
          'CPIS', 'IV', 'SAT', 'SBT', 'AKI', 'CRRT', 'DKA', 'HHS',
        ]}
      />
    </div>
  );
}
