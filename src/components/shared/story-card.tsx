import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'

interface StoryCardProps {
  story: {
    id: string
    title: string
    excerpt?: string
    created_at: string
    profiles?: { username: string | null }
    likes_count?: number
    comments_count?: number
    bookmarks_count?: number
  }
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/stories/${story.id}`}>
      <Card className="h-full hover:shadow-md transition-all hover:border-primary/20 group">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {story.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {story.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {story.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {story.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                {story.profiles?.username || '匿名'}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <time className="text-xs text-muted-foreground">
                {new Date(story.created_at).toLocaleDateString('zh-CN')}
              </time>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {story.likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {story.comments_count || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
