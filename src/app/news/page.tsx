import { createClient } from '@/lib/supabase/server'
import { NewsCard } from '@/components/shared/news-card'
import { getContentStats } from '@/lib/utils/content-stats'

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: newsData } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  let news = newsData || []
  if (news.length > 0) {
    const stats = await getContentStats(supabase, 'news', news.map(n => n.id))
    news = news.map(n => ({
      ...n,
      likes_count: stats.get(n.id)?.likes || 0,
      comments_count: stats.get(n.id)?.comments || 0,
      bookmarks_count: stats.get(n.id)?.bookmarks || 0,
    }))
  }

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
