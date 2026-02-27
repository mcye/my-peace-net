import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LikeButton } from '@/components/shared/like-button'
import { BookmarkButton } from '@/components/shared/bookmark-button'
import { ShareButton } from '@/components/shared/share-button'
import { CommentSection } from '@/components/shared/comment-section'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!news) {
    notFound()
  }

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

      <div className="prose prose-neutral max-w-none mb-8">
        {news.content}
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-b">
        <LikeButton contentType="news" contentId={news.id} />
        <BookmarkButton contentType="news" contentId={news.id} />
        <ShareButton title={news.title} />
      </div>

      <CommentSection contentType="news" contentId={news.id} />
    </article>
  )
}
