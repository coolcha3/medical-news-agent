import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
  const offset = parseInt(searchParams.get('offset') || '0');
  const search = searchParams.get('search') || '';

  let query = supabase
    .from('articles')
    .select('id, title, url, source, source_icon, published_at, summary, tags, created_at')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (source && source !== 'All') {
    query = query.eq('source', source);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data || [], total: data?.length || 0 });
}
