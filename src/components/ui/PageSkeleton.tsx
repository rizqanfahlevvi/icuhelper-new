import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="w-full h-full p-4 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-1/3 bg-[var(--bg-tertiary)] rounded-lg"></div>
        <div className="h-4 w-1/2 bg-[var(--bg-tertiary)] rounded-md"></div>
      </div>

      {/* Hero / Banner Skeleton */}
      <div className="h-32 w-full bg-[var(--bg-tertiary)] rounded-2xl"></div>

      {/* Grid or List Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-2 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--separator)]">
            <div className="h-10 w-10 bg-[var(--bg-tertiary)] rounded-lg"></div>
            <div className="h-4 w-3/4 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-3 w-1/2 bg-[var(--bg-tertiary)] rounded"></div>
          </div>
        ))}
      </div>
      
      {/* Additional full width block */}
      <div className="h-24 w-full bg-[var(--bg-secondary)] rounded-xl border border-[var(--separator)]"></div>
    </div>
  );
}
