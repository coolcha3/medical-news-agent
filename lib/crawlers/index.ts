import { Article, CrawlResult } from '@/types';
import { crawlAllRSS } from './rss';
import { crawlPubMed } from './pubmed';
import { supabaseAdmin } from '@/lib/supabase';
import { summarizeArticle } from '@/lib/openrouter';

export async function runFullCrawl(): Promise<CrawlResult[]> {
  console.log('[Crawl] Starting full crawl...');

  // Crawl all sources in parallel
  const [rssArticles, pubmedArticles] = await Promise.allSettled([
    crawlAllRSS(),
    crawlPubMed(),
  ]);

  const allArticles: Article[] = [
    ...(rssArticles.status === 'fulfilled' ? rssArticles.value : []),
    ...(pubmedArticles.status === 'fulfilled' ? pubmedArticles.value : []),
  ];

  console.log(`[Crawl] Fetched ${allArticles.length} articles total`);

  // Save articles to Supabase (upsert to avoid duplicates)
  const results = new Map<string, CrawlResult>();

  for (const source of ['WHO', 'CDC', 'NIH', 'PubMed', 'MedicalXpress', 'GoogleNews', 'Reuters'] as const) {
    results.set(source, { source, fetched: 0, saved: 0 });
  }

  for (const article of allArticles) {
    const result = results.get(article.source)!;
    result.fetched++;

    try {
      const { error } = await supabaseAdmin.from('articles').upsert(
        {
          title: article.title,
          url: article.url,
          source: article.source,
          source_icon: article.source_icon,
          published_at: article.published_at,
          original_content: article.original_content,
        },
        { onConflict: 'url', ignoreDuplicates: true }
      );

      if (!error) {
        result.saved++;
      }
    } catch (err) {
      console.error(`[Save] Error saving article from ${article.source}:`, err);
    }
  }

  // Summarize articles that don't have summaries yet (up to 20 per crawl)
  await summarizeUnsummarized();

  return Array.from(results.values());
}

async function summarizeUnsummarized() {
  try {
    const { data: unsummarized } = await supabaseAdmin
      .from('articles')
      .select('id, title, original_content')
      .is('summary', null)
      .not('original_content', 'eq', '')
      .limit(20);

    if (!unsummarized || unsummarized.length === 0) return;

    console.log(`[Summarize] Processing ${unsummarized.length} articles...`);

    for (const article of unsummarized) {
      try {
        const result = await summarizeArticle(article.title, article.original_content);
        if (result.summary) {
          await supabaseAdmin
            .from('articles')
            .update({ summary: result.summary, tags: result.tags })
            .eq('id', article.id);
        }
        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`[Summarize] Error for article ${article.id}:`, err);
      }
    }
  } catch (err) {
    console.error('[Summarize] Error fetching unsummarized articles:', err);
  }
}
