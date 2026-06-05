'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import FilterBar from '@/components/FilterBar';
import ArticleGrid from '@/components/ArticleGrid';
import { Article } from '@/types';

interface Stats {
  stats: { source: string; count: number }[];
  total: number;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats>({ stats: [], total: 0 });
  const [activeSource, setActiveSource] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCrawling, setIsCrawling] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [crawlMessage, setCrawlMessage] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '60' });
      if (activeSource !== 'All') params.set('source', activeSource);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/articles?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles || []);

      if (data.articles?.length > 0) {
        setLastUpdated(data.articles[0].created_at || new Date().toISOString());
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }, [activeSource, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // stats are non-critical
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleCrawl = async () => {
    setIsCrawling(true);
    setCrawlMessage('');
    try {
      const res = await fetch('/api/crawl', { method: 'POST' });
      const data = await res.json();
      setCrawlMessage(data.message || '수집 완료');
      await Promise.all([fetchArticles(), fetchStats()]);
    } catch (err) {
      setCrawlMessage('수집 중 오류가 발생했습니다: ' + String(err));
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onCrawl={handleCrawl} isCrawling={isCrawling} lastUpdated={lastUpdated} />

      {crawlMessage && (
        <div className="bg-green-50 border-b border-green-200 text-green-800 text-sm text-center py-2 px-4">
          ✅ {crawlMessage}
        </div>
      )}

      <StatsBar stats={stats.stats} total={stats.total} />

      <FilterBar
        activeSource={activeSource}
        onSourceChange={(s) => { setActiveSource(s); setCrawlMessage(''); }}
        search={search}
        onSearchChange={setSearch}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Disclaimer */}
        <p className="text-xs text-slate-400 mb-5 text-center">
          ⚠️ AI가 생성한 요약입니다. 의학적 결정에는 반드시 원문과 전문가 의견을 확인하세요.
        </p>

        <ArticleGrid articles={articles} isLoading={isLoading} error={error} />
      </main>

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200 bg-white">
        <p>
          의료 뉴스 Agent — WHO · CDC · NIH · PubMed · MedicalXpress · Google News · Reuters
        </p>
        <p className="mt-1">Powered by OpenRouter · Supabase · Vercel</p>
      </footer>
    </div>
  );
}
