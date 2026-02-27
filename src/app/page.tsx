import { createClient } from '@/lib/supabase/server'
import { NewsCard } from '@/components/shared/news-card'
import { StoryCard } from '@/components/shared/story-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getContentStats } from '@/lib/utils/content-stats'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: newsData } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  let news = newsData || []
  if (news.length > 0) {
    const newsStats = await getContentStats(supabase, 'news', news.map(n => n.id))
    news = news.map(n => ({
      ...n,
      likes_count: newsStats.get(n.id)?.likes || 0,
      comments_count: newsStats.get(n.id)?.comments || 0,
      bookmarks_count: newsStats.get(n.id)?.bookmarks || 0,
    }))
  }

  const { data: storiesData } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6)

  let stories = storiesData || []

  if (stories.length > 0) {
    const userIds = [...new Set(stories.map(s => s.user_id))]
    const [profilesRes, storyStats] = await Promise.all([
      supabase.from('profiles').select('id, username').in('id', userIds),
      getContentStats(supabase, 'story', stories.map(s => s.id)),
    ])

    const profileMap = new Map(profilesRes.data?.map(p => [p.id, p.username]) || [])
    stories = stories.map(s => ({
      ...s,
      profiles: { username: profileMap.get(s.user_id) || null },
      likes_count: storyStats.get(s.id)?.likes || 0,
      comments_count: storyStats.get(s.id)?.comments || 0,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-16 mb-12">
        <h1 className="text-4xl font-bold mb-4">Peace Net</h1>
        <p className="text-xl text-muted-foreground mb-8">
          关注乌克兰，传递和平之声
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/stories/new">分享你的故事</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">了解更多</Link>
          </Button>
        </div>
      </section>

      {/* News */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">最新新闻</h2>
          <Button variant="ghost" asChild>
            <Link href="/news">查看全部</Link>
          </Button>
        </div>
        {news && news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">暂无新闻</p>
        )}
      </section>

      {/* Stories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">用户故事</h2>
          <Button variant="ghost" asChild>
            <Link href="/stories">查看全部</Link>
          </Button>
        </div>
        {stories && stories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">暂无故事</p>
        )}
      </section>
    </div>
  )
}
