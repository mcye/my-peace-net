import { SupabaseClient } from '@supabase/supabase-js'

export async function getContentStats(
  supabase: SupabaseClient,
  contentType: 'news' | 'story',
  contentIds: string[]
) {
  if (contentIds.length === 0) return new Map()

  const [likesRes, commentsRes, bookmarksRes] = await Promise.all([
    supabase
      .from('likes')
      .select('content_id')
      .eq('content_type', contentType)
      .in('content_id', contentIds),
    supabase
      .from('comments')
      .select('content_id')
      .eq('content_type', contentType)
      .eq('status', 'approved')
      .in('content_id', contentIds),
    supabase
      .from('bookmarks')
      .select('content_id')
      .eq('content_type', contentType)
      .in('content_id', contentIds),
  ])

  const stats = new Map<string, { likes: number; comments: number; bookmarks: number }>()

  contentIds.forEach(id => {
    stats.set(id, { likes: 0, comments: 0, bookmarks: 0 })
  })

  likesRes.data?.forEach(l => {
    const s = stats.get(l.content_id)
    if (s) s.likes++
  })

  commentsRes.data?.forEach(c => {
    const s = stats.get(c.content_id)
    if (s) s.comments++
  })

  bookmarksRes.data?.forEach(b => {
    const s = stats.get(b.content_id)
    if (s) s.bookmarks++
  })

  return stats
}
