import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('articles')
    .select('source')
    .order('source');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    counts[row.source] = (counts[row.source] || 0) + 1;
  }

  const stats = Object.entries(counts).map(([source, count]) => ({ source, count }));
  const total = stats.reduce((sum, s) => sum + s.count, 0);

  return NextResponse.json({ stats, total });
}
