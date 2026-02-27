'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

interface FollowButtonProps {
  userId: string
}

export function FollowButton({ userId }: FollowButtonProps) {
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const supabase = createClient()

  useEffect(() => {
    if (!user || user.id === userId) return

    const checkFollow = async () => {
      const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single()

      setFollowing(!!data)
    }

    checkFollow()
  }, [user, userId, supabase])

  if (!user || user.id === userId) return null

  const handleFollow = async () => {
    setLoading(true)

    if (following) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId)

      setFollowing(false)
      toast.success('已取消关注')
    } else {
      await supabase.from('follows').insert({
        follower_id: user.id,
        following_id: userId,
      })

      setFollowing(true)
      toast.success('已关注')
    }

    setLoading(false)
  }

  return (
    <Button
      variant={following ? 'outline' : 'default'}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
    >
      {following ? '已关注' : '关注'}
    </Button>
  )
}
