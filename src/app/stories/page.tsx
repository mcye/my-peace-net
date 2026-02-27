import { createClient } from '@/lib/supabase/server'
import { StoryCard } from '@/components/shared/story-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function StoriesPage() {
  const supabase = await createClient()

  const { data: storiesData } = await supabase
    .from('stories')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  let stories = storiesData || []

  if (stories.length > 0) {
    const userIds = [...new Set(stories.map(s => s.user_id))]
    const contentIds = stories.map(s => s.id)

    const [profilesRes, likesRes, commentsRes] = await Promise.all([
      supabase.from('profiles').select('id, username').in('id', userIds),
      supabase.from('likes').select('content_id').eq('content_type', 'story').in('content_id', contentIds),
      supabase.from('comments').select('content_id').eq('content_type', 'story').eq('status', 'approved').in('content_id', contentIds),
    ])

    const profileMap = new Map(profilesRes.data?.map(p => [p.id, p.username]) || [])
    const likesMap = new Map<string, number>()
    const commentsMap = new Map<string, number>()

    likesRes.data?.forEach(l => likesMap.set(l.content_id, (likesMap.get(l.content_id) || 0) + 1))
    commentsRes.data?.forEach(c => commentsMap.set(c.content_id, (commentsMap.get(c.content_id) || 0) + 1))

    stories = stories.map(s => ({
      ...s,
      profiles: { username: profileMap.get(s.user_id) || null },
      likes_count: likesMap.get(s.id) || 0,
      comments_count: commentsMap.get(s.id) || 0,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">故事</h1>
        <Button asChild>
          <Link href="/stories/new">分享你的故事</Link>
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
    </div>
  )
}
