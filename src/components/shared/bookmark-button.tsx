'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

interface BookmarkButtonProps {
  contentType: 'news' | 'story'
  contentId: string
  initialBookmarked?: boolean
}

export function BookmarkButton({ contentType, contentId, initialBookmarked = false }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const { user } = useUser()
  const supabase = createClient()

  const handleBookmark = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (bookmarked) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .eq('content_id', contentId)

      setBookmarked(false)
      toast.success('已取消收藏')
    } else {
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
      })

      setBookmarked(true)
      toast.success('已收藏')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBookmark}
      className={bookmarked ? 'text-primary' : ''}
    >
      <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
    </Button>
  )
}
