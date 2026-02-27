import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NewsCardProps {
  news: {
    id: string
    title: string
    slug: string
    excerpt?: string
    published_at?: string
  }
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="line-clamp-2">{news.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {news.excerpt && (
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {news.excerpt}
            </p>
          )}
          {news.published_at && (
            <time className="text-sm text-muted-foreground">
              {new Date(news.published_at).toLocaleDateString('zh-CN')}
            </time>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
