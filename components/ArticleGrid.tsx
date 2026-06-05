'use client';

import { AlertCircle, Newspaper } from 'lucide-react';
import { Article } from '@/types';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  isLoading: boolean;
  error?: string;
}

export default function ArticleGrid({ articles, isLoading, error }: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-10 bg-slate-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-slate-100 rounded animate-pulse w-3/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-slate-600 font-medium">데이터를 불러오는 데 실패했습니다</p>
        <p className="text-slate-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Newspaper className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-slate-500 font-medium">아직 수집된 뉴스가 없습니다</p>
        <p className="text-slate-400 text-sm mt-1">상단의 &apos;지금 수집&apos; 버튼을 눌러 뉴스를 가져오세요</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article) => (
        <ArticleCard key={article.id ?? article.url} article={article} />
      ))}
    </div>
  );
}
