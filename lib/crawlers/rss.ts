import Parser from 'rss-parser';
import { Article, SourceName } from '@/types';

interface RSSSource {
  name: SourceName;
  icon: string;
  url: string;
  limit?: number;
}

const RSS_SOURCES: RSSSource[] = [
  {
    name: 'WHO',
    icon: '🌍',
    url: 'https://www.who.int/feeds/entity/csr/don/en/rss.xml',
    limit: 10,
  },
  {
    name: 'CDC',
    icon: '🏛️',
    url: 'https://tools.cdc.gov/api/v2/resources/media/403372.rss',
    limit: 10,
  },
  {
    name: 'NIH',
    icon: '🔬',
    url: 'https://nihrecord.nih.gov/rss.xml',
    limit: 10,
  },
  {
    name: 'MedicalXpress',
    icon: '🏥',
    url: 'https://medicalxpress.com/rss-feed/',
    limit: 10,
  },
  {
    name: 'GoogleNews',
    icon: '📰',
    url: 'https://news.google.com/rss/search?q=disease+outbreak+health&hl=en-US&gl=US&ceid=US:en',
    limit: 10,
  },
  {
    name: 'Reuters',
    icon: '📡',
    url: 'https://news.google.com/rss/search?q=site:reuters.com+health+disease&hl=en-US&gl=US&ceid=US:en',
    limit: 8,
  },
];

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; MedicalNewsAgent/1.0; +https://medical-news-agent.vercel.app)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
});

function extractText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function crawlRSSSource(source: RSSSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = feed.items.slice(0, source.limit ?? 10);

    return items
      .filter((item) => item.title && item.link)
      .map((item) => {
        const rawContent =
          item['content:encoded'] || item.content || item.contentSnippet || item.summary || '';
        return {
          title: extractText(item.title || ''),
          url: item.link || '',
          source: source.name,
          source_icon: source.icon,
          published_at: item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString(),
          original_content: extractText(rawContent).slice(0, 5000),
        };
      });
  } catch (err) {
    console.error(`[${source.name}] RSS crawl failed:`, err);
    return [];
  }
}

export async function crawlAllRSS(): Promise<Article[]> {
  const results = await Promise.allSettled(RSS_SOURCES.map((s) => crawlRSSSource(s)));
  return results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}
