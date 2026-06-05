'use client';

import { ExternalLink, Calendar, Tag } from 'lucide-react';
import { Article, SOURCE_META, SourceName } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const meta = SOURCE_META[article.source as SourceName];
  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(article.published_at), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return '';
    }
  })();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Source badge */}
      <div className={`${meta?.color ?? 'bg-slate-500'} px-4 py-2 flex items-center justify-between`}>
        <span className="text-white text-xs font-semibold flex items-center gap-1.5">
          <span>{article.source_icon}</span>
          {meta?.label ?? article.source}
        </span>
        {timeAgo && (
          <span className="text-white/70 text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {timeAgo}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group font-semibold text-slate-800 hover:text-blue-600 line-clamp-3 leading-snug transition-colors"
        >
          {article.title}
        </a>

        {article.summary ? (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 flex-1">
            {article.summary}
          </p>
        ) : (
          <div className="flex-1">
            <div className="h-3 bg-slate-100 rounded animate-pulse mb-2 w-full" />
            <div className="h-3 bg-slate-100 rounded animate-pulse mb-2 w-4/5" />
            <div className="h-3 bg-slate-100 rounded animate-pulse w-3/5" />
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read more */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-auto pt-2 border-t border-slate-100"
        >
          원문 보기
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
