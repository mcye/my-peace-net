import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StoryCard } from '@/components/shared/story-card'
import { FollowButton } from '@/components/shared/follow-button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  const { data: storiesData } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const stories = (storiesData || []).map(s => ({
    ...s,
    profiles: { username: profile.username }
  }))

  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', id)

  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start gap-6 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl">
            {profile.username?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold">{profile.username || '匿名用户'}</h1>
            <FollowButton userId={id} />
          </div>
          {profile.bio && <p className="text-muted-foreground mb-2">{profile.bio}</p>}
          <div className="flex gap-4 text-sm">
            <span><strong>{followersCount || 0}</strong> 粉丝</span>
            <span><strong>{followingCount || 0}</strong> 关注</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stories">
        <TabsList>
          <TabsTrigger value="stories">故事</TabsTrigger>
        </TabsList>
        <TabsContent value="stories" className="mt-6">
          {stories && stories.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">暂无故事</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
