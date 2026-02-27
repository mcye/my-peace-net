import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LikeButton } from '@/components/shared/like-button'
import { BookmarkButton } from '@/components/shared/bookmark-button'
import { ShareButton } from '@/components/shared/share-button'
import { CommentSection } from '@/components/shared/comment-section'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: storyData } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (!storyData) {
    notFound()
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', storyData.user_id)
    .single()

  const story = {
    ...storyData,
    profiles: { username: profileData?.username || null }
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{story.title}</h1>
        <div className="flex items-center gap-3">
          <Link href={`/profile/${story.user_id}`} className="flex items-center gap-2 hover:underline">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {story.profiles?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{story.profiles?.username || '匿名'}</span>
          </Link>
          <span className="text-muted-foreground">·</span>
          <time className="text-muted-foreground">
            {new Date(story.created_at).toLocaleDateString('zh-CN')}
          </time>
        </div>
      </header>

      <div className="max-w-none mb-8 text-base leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
        {story.content}
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-b">
        <LikeButton contentType="story" contentId={story.id} />
        <BookmarkButton contentType="story" contentId={story.id} />
        <ShareButton title={story.title} />
      </div>

      <CommentSection contentType="story" contentId={story.id} />
    </article>
  )
}
