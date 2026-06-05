'use client';

import { Search, X } from 'lucide-react';
import { SourceName, SOURCE_META } from '@/types';

interface FilterBarProps {
  activeSource: string;
  onSourceChange: (source: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

const SOURCES: string[] = ['All', 'WHO', 'CDC', 'NIH', 'PubMed', 'MedicalXpress', 'GoogleNews', 'Reuters'];

export default function FilterBar({
  activeSource,
  onSourceChange,
  search,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Source tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-1 sm:pb-0 flex-1">
            {SOURCES.map((source) => {
              const isActive = activeSource === source;
              const meta = source !== 'All' ? SOURCE_META[source as SourceName] : null;
              return (
                <button
                  key={source}
                  onClick={() => onSourceChange(source)}
                  className={`flex-shrink-0 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-all duration-150 ${
                    isActive
                      ? meta
                        ? `${meta.color} text-white shadow-sm`
                        : 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {meta?.icon && <span className="text-xs">{meta.icon}</span>}
                  {source === 'All' ? '전체' : meta?.label ?? source}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0 w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="제목 또는 요약 검색..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
