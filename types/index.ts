export type SourceName =
  | 'WHO'
  | 'CDC'
  | 'NIH'
  | 'PubMed'
  | 'MedicalXpress'
  | 'GoogleNews'
  | 'Reuters';

export interface Article {
  id?: string;
  title: string;
  url: string;
  source: SourceName;
  source_icon: string;
  published_at: string;
  original_content: string;
  summary?: string;
  tags?: string[];
  created_at?: string;
}

export interface CrawlResult {
  source: SourceName;
  fetched: number;
  saved: number;
  error?: string;
}

export interface StatsRow {
  source: string;
  count: number;
}

export const SOURCE_META: Record<
  SourceName,
  { icon: string; color: string; label: string; url: string }
> = {
  WHO: {
    icon: '🌍',
    color: 'bg-blue-600',
    label: 'WHO',
    url: 'https://www.who.int',
  },
  CDC: {
    icon: '🏛️',
    color: 'bg-red-600',
    label: 'CDC',
    url: 'https://www.cdc.gov',
  },
  NIH: {
    icon: '🔬',
    color: 'bg-indigo-600',
    label: 'NIH',
    url: 'https://www.nih.gov',
  },
  PubMed: {
    icon: '📖',
    color: 'bg-cyan-600',
    label: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
  },
  MedicalXpress: {
    icon: '🏥',
    color: 'bg-orange-500',
    label: 'MedicalXpress',
    url: 'https://medicalxpress.com',
  },
  GoogleNews: {
    icon: '📰',
    color: 'bg-sky-500',
    label: 'Google News',
    url: 'https://news.google.com',
  },
  Reuters: {
    icon: '📡',
    color: 'bg-amber-600',
    label: 'Reuters',
    url: 'https://www.reuters.com',
  },
};
