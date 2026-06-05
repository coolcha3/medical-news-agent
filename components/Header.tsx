'use client';

import { useState } from 'react';
import { Activity, RefreshCw, Stethoscope } from 'lucide-react';

interface HeaderProps {
  onCrawl: () => void;
  isCrawling: boolean;
  lastUpdated?: string;
}

export default function Header({ onCrawl, isCrawling, lastUpdated }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">의료 뉴스 Agent</h1>
              <p className="text-xs text-blue-300 hidden sm:block">
                WHO · CDC · NIH · PubMed · MedicalXpress · Google News · Reuters
              </p>
            </div>
          </div>

          {/* Status + Crawl Button */}
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
                <Activity className="w-3.5 h-3.5 text-green-400" />
                <span>마지막 업데이트: {new Date(lastUpdated).toLocaleString('ko-KR')}</span>
              </div>
            )}
            <button
              onClick={onCrawl}
              disabled={isCrawling}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isCrawling ? 'animate-spin' : ''}`} />
              <span>{isCrawling ? '수집 중...' : '지금 수집'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
