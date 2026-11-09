import React, { ReactNode, useState } from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface PageHeaderProps {
  badgeIcon?: LucideIcon;
  badgeText?: string;
  title: string;
  description: string;
  rightContent?: ReactNode;
  /**
   * Mode ringkas untuk ponsel: judul sudah tampil di header aplikasi, jadi di layar <md badge disembunyikan,
   * judul diperkecil, dan deskripsi dilipat di balik tombol "Tentang". Tampilan desktop tidak berubah.
   */
  compact?: boolean;
}

export function PageHeader({ badgeIcon: Icon, badgeText, title, description, rightContent, compact = false }: PageHeaderProps) {
  const [showDesc, setShowDesc] = useState(false);

  if (compact) {
    return (
      <div className="mb-3 md:mb-6">
        <div className="hidden md:flex md:items-start justify-between gap-4">
          <div className="flex flex-col items-start gap-2 max-w-2xl">
            {badgeText && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-black tracking-wider uppercase mb-1">
                {Icon && <Icon size={14} />}
                {badgeText}
              </div>
            )}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-lg">{description}</p>
          </div>
          {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
        </div>
        <div className="md:hidden">
          <div className="flex items-center justify-end gap-2">
            {/* Judul sudah tampil di header shell (ponsel) — h1 tetap ada untuk pembaca layar. */}
            <h1 className="sr-only">{title}</h1>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowDesc(s => !s)}
                aria-expanded={showDesc}
                className="min-h-[36px] flex items-center gap-1 px-2 rounded-lg text-[12px] font-semibold text-[var(--label-secondary)] hover:bg-[var(--fill-secondary)]"
              >
                <Info className="w-3.5 h-3.5" /> Tentang
              </button>
              {rightContent}
            </div>
          </div>
          {showDesc && <p className="mt-1 text-muted-foreground text-[13px] leading-relaxed">{description}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
      <div className="flex flex-col items-start gap-2 max-w-2xl">
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-black tracking-wider uppercase mb-1">
            {Icon && <Icon size={14} />}
            {badgeText}
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="text-muted-foreground text-[13px] md:text-sm font-medium leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
      {rightContent && (
        <div className="flex-shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
}
