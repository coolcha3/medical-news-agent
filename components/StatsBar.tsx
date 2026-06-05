'use client';

import { SOURCE_META, SourceName } from '@/types';

interface StatsBarProps {
  stats: { source: string; count: number }[];
  total: number;
}

export default function StatsBar({ stats, total }: StatsBarProps) {
  if (!stats.length) return null;

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">
            총 {total.toLocaleString()}건
          </span>
          {stats.map(({ source, count }) => {
            const meta = SOURCE_META[source as SourceName];
            if (!meta) return null;
            return (
              <span
                key={source}
                className={`inline-flex items-center gap-1 text-xs font-medium text-white px-2.5 py-1 rounded-full ${meta.color}`}
              >
                {meta.icon} {meta.label}
                <span className="bg-white/20 rounded-full px-1.5">{count}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
