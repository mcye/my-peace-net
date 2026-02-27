'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

interface LikeButtonProps {
  contentType: 'news' | 'story'
  contentId: string
}

export function LikeButton({ contentType, contentId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)
  const { user } = useUser()
  const supabase = createClient()

  useEffect(() => {
    const fetchLikes = async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', contentType)
        .eq('content_id', contentId)

      setCount(count || 0)

      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_type', contentType)
          .eq('content_id', contentId)
          .single()

        setLiked(!!data)
      }
    }

    fetchLikes()
  }, [user, contentType, contentId, supabase])

  const handleLike = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    if (liked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .eq('content_id', contentId)

      setLiked(false)
      setCount((c) => c - 1)
    } else {
      await supabase.from('likes').insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
      })

      setLiked(true)
      setCount((c) => c + 1)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={liked ? 'text-red-500' : ''}
    >
      <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
      {count}
    </Button>
  )
}
