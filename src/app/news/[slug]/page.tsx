import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LikeButton } from '@/components/shared/like-button'
import { BookmarkButton } from '@/components/shared/bookmark-button'
import { ShareButton } from '@/components/shared/share-button'
import { CommentSection } from '@/components/shared/comment-section'
import { getSocialData } from '@/lib/utils/social-data'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const [newsRes, userRes] = await Promise.all([
    supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
    supabase.auth.getUser(),
  ])

  const news = newsRes.data
  if (!news) {
    notFound()
  }

  const userId = userRes.data.user?.id
  const social = await getSocialData(supabase, 'news', news.id, userId)

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        {news.published_at && (
          <time className="text-muted-foreground">
            {new Date(news.published_at).toLocaleDateString('zh-CN')}
          </time>
        )}
      </header>

      <div className="max-w-none mb-8 text-base leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
        {news.content}
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-b">
        <LikeButton
          contentType="news"
          contentId={news.id}
          initialCount={social.likesCount}
          initialLiked={social.isLiked}
        />
        <BookmarkButton
          contentType="news"
          contentId={news.id}
          initialBookmarked={social.isBookmarked}
        />
        <ShareButton title={news.title} />
      </div>

      <CommentSection
        contentType="news"
        contentId={news.id}
        initialComments={social.comments}
      />
    </article>
  )
}
