import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  badgeIcon?: LucideIcon;
  badgeText?: string;
  title: string;
  description: string;
  rightContent?: ReactNode;
}

export function PageHeader({ badgeIcon: Icon, badgeText, title, description, rightContent }: PageHeaderProps) {
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
