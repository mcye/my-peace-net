'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles?: { username: string | null }
}

interface CommentSectionProps {
  contentType: 'news' | 'story'
  contentId: string
  initialComments?: Comment[]
}

export function CommentSection({ contentType, contentId, initialComments = [] }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const supabase = createClient()

  const fetchComments = async () => {
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (!commentsData || commentsData.length === 0) {
      setComments([])
      return
    }

    const userIds = [...new Set(commentsData.map(c => c.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds)

    const profileMap = new Map(profilesData?.map(p => [p.id, p.username]) || [])

    setComments(commentsData.map(c => ({
      ...c,
      profiles: { username: profileMap.get(c.user_id) || null }
    })))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('请先登录')
      return
    }
    if (!newComment.trim()) return

    setLoading(true)
    const { error } = await supabase.from('comments').insert({
      user_id: user.id,
      content_type: contentType,
      content_id: contentId,
      content: newComment.trim(),
    })

    if (error) {
      toast.error('评论失败')
    } else {
      toast.success('评论已提交，等待审核')
      setNewComment('')
    }
    setLoading(false)
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">评论</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          placeholder={user ? '写下你的评论...' : '请先登录后评论'}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user}
          className="mb-2"
        />
        <Button type="submit" disabled={!user || loading}>
          {loading ? '提交中...' : '提交评论'}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground">暂无评论</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.profiles?.username || '匿名用户'}
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                  </time>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
