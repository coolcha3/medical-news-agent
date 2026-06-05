import { NextResponse } from 'next/server';
import { runFullCrawl } from '@/lib/crawlers';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST() {
  try {
    const results = await runFullCrawl();
    const totalSaved = results.reduce((sum, r) => sum + r.saved, 0);
    const totalFetched = results.reduce((sum, r) => sum + r.fetched, 0);

    return NextResponse.json({
      success: true,
      message: `Crawled ${totalFetched} articles, saved ${totalSaved} new articles`,
      results,
    });
  } catch (err) {
    console.error('[Crawl API] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Crawl failed', details: String(err) },
      { status: 500 }
    );
  }
}
