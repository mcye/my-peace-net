import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'

interface NewsCardProps {
  news: {
    id: string
    title: string
    slug: string
    excerpt?: string
    published_at?: string
    likes_count?: number
    comments_count?: number
    bookmarks_count?: number
  }
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <Card className="h-full hover:shadow-md transition-all hover:border-primary/20 group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {news.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {news.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {news.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            {news.published_at && (
              <time className="text-xs text-muted-foreground">
                {new Date(news.published_at).toLocaleDateString('zh-CN')}
              </time>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {news.likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {news.comments_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Bookmark className="h-3.5 w-3.5" />
                {news.bookmarks_count || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
