import { Article } from '@/types';

const NCBI_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const SEARCH_TERM = 'infectious disease[Title/Abstract] OR outbreak[Title/Abstract] OR pandemic[Title/Abstract]';

interface ESearchResult {
  esearchresult: {
    idlist: string[];
  };
}

interface ESummaryArticle {
  uid: string;
  title: string;
  fulljournalname: string;
  pubdate: string;
  authors: Array<{ name: string }>;
  elocationid: string;
}

interface ESummaryResult {
  result: Record<string, ESummaryArticle>;
}

export async function crawlPubMed(): Promise<Article[]> {
  try {
    // Step 1: search for recent articles
    const searchUrl = `${NCBI_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(SEARCH_TERM)}&retmax=10&sort=pub+date&retmode=json&datetype=pdat&reldate=7`;
    const searchRes = await fetch(searchUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'MedicalNewsAgent/1.0 (coolcha3@gmail.com)' },
    });

    if (!searchRes.ok) throw new Error(`Search failed: ${searchRes.status}`);
    const searchData: ESearchResult = await searchRes.json();
    const ids = searchData.esearchresult?.idlist ?? [];
    if (ids.length === 0) return [];

    // Step 2: fetch summaries
    const summaryUrl = `${NCBI_BASE}/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'MedicalNewsAgent/1.0 (coolcha3@gmail.com)' },
    });

    if (!summaryRes.ok) throw new Error(`Summary failed: ${summaryRes.status}`);
    const summaryData: ESummaryResult = await summaryRes.json();

    const mapped = ids.map((id) => {
      const art = summaryData.result[id];
      if (!art || !art.title) return null;

      const authors =
        art.authors
          ?.slice(0, 3)
          .map((a) => a.name)
          .join(', ') || '';
      const journal = art.fulljournalname || '';
      const content = `${journal}. ${authors}. DOI: ${art.elocationid || id}`;

      const article: Article = {
        title: art.title.replace(/\.$/, ''),
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        source: 'PubMed',
        source_icon: '📖',
        published_at: art.pubdate
          ? new Date(art.pubdate).toISOString()
          : new Date().toISOString(),
        original_content: content,
      };
      return article;
    });

    return mapped.filter((a): a is Article => a !== null);
  } catch (err) {
    console.error('[PubMed] crawl failed:', err);
    return [];
  }
}
