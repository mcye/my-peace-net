import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface StoryCardProps {
  story: {
    id: string
    title: string
    excerpt?: string
    created_at: string
    profiles?: { username: string | null }
  }
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/stories/${story.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="line-clamp-2">{story.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {story.excerpt && (
            <p className="text-muted-foreground line-clamp-3 mb-4">
              {story.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {story.profiles?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {story.profiles?.username || '匿名'}
            </span>
            <span className="text-sm text-muted-foreground">·</span>
            <time className="text-sm text-muted-foreground">
              {new Date(story.created_at).toLocaleDateString('zh-CN')}
            </time>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
