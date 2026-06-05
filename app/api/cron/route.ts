import { NextRequest, NextResponse } from 'next/server';
import { runFullCrawl } from '@/lib/crawlers';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await runFullCrawl();
    const totalSaved = results.reduce((sum, r) => sum + r.saved, 0);
    const totalFetched = results.reduce((sum, r) => sum + r.fetched, 0);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      fetched: totalFetched,
      saved: totalSaved,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
