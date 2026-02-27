import { unstable_cache } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NewsCard } from '@/components/shared/news-card'

export const runtime = 'edge'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const getNewsWithStats = unstable_cache(
  async () => {
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

    const { data: newsData } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    let news = newsData || []
    if (news.length > 0) {
      const contentIds = news.map(n => n.id)
      const [likesRes, commentsRes, bookmarksRes] = await Promise.all([
        supabase.from('likes').select('content_id').eq('content_type', 'news').in('content_id', contentIds),
        supabase.from('comments').select('content_id').eq('content_type', 'news').eq('status', 'approved').in('content_id', contentIds),
        supabase.from('bookmarks').select('content_id').eq('content_type', 'news').in('content_id', contentIds),
      ])

      const likesMap = new Map<string, number>()
      const commentsMap = new Map<string, number>()
      const bookmarksMap = new Map<string, number>()

      likesRes.data?.forEach(l => likesMap.set(l.content_id, (likesMap.get(l.content_id) || 0) + 1))
      commentsRes.data?.forEach(c => commentsMap.set(c.content_id, (commentsMap.get(c.content_id) || 0) + 1))
      bookmarksRes.data?.forEach(b => bookmarksMap.set(b.content_id, (bookmarksMap.get(b.content_id) || 0) + 1))

      news = news.map(n => ({
        ...n,
        likes_count: likesMap.get(n.id) || 0,
        comments_count: commentsMap.get(n.id) || 0,
        bookmarks_count: bookmarksMap.get(n.id) || 0,
      }))
    }
    return news
  },
  ['news-list'],
  { revalidate: 30 }
)

export default async function NewsPage() {
  const news = await getNewsWithStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">新闻</h1>

      {news && news.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">暂无新闻</p>
      )}
    </div>
  )
}
