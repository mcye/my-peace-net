import { SupabaseClient } from '@supabase/supabase-js'

interface SocialData {
  likesCount: number
  bookmarksCount: number
  isLiked: boolean
  isBookmarked: boolean
  comments: Array<{
    id: string
    content: string
    created_at: string
    user_id: string
    profiles?: { username: string | null }
  }>
}

export async function getSocialData(
  supabase: SupabaseClient,
  contentType: 'news' | 'story',
  contentId: string,
  userId?: string
): Promise<SocialData> {
  const [likesRes, bookmarksRes, commentsRes, userLikeRes, userBookmarkRes] = await Promise.all([
    supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', contentType)
      .eq('content_id', contentId),
    supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('content_type', contentType)
      .eq('content_id', contentId),
    supabase
      .from('comments')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
    userId
      ? supabase
          .from('likes')
          .select('id')
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .eq('content_id', contentId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    userId
      ? supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', userId)
          .eq('content_type', contentType)
          .eq('content_id', contentId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  let comments = commentsRes.data || []
  if (comments.length > 0) {
    const userIds = [...new Set(comments.map(c => c.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds)

    const profileMap = new Map(profiles?.map(p => [p.id, p.username]) || [])
    comments = comments.map(c => ({
      ...c,
      profiles: { username: profileMap.get(c.user_id) || null }
    }))
  }

  return {
    likesCount: likesRes.count || 0,
    bookmarksCount: bookmarksRes.count || 0,
    isLiked: !!userLikeRes.data,
    isBookmarked: !!userBookmarkRes.data,
    comments,
  }
}
