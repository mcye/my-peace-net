'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Comment {
  id: string
  content: string
  content_type: string
  status: string
  created_at: string
  profiles?: { username: string | null }
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
    setComments(data || [])
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('comments').update({ status }).eq('id', id)
    toast.success(status === 'approved' ? '已通过' : '已拒绝')
    fetchComments()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">评论审核</h1>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="py-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {comment.profiles?.username || '匿名'} · {comment.content_type}
                </span>
                <span className={`text-sm ${comment.status === 'pending' ? 'text-orange-500' : ''}`}>
                  {comment.status}
                </span>
              </div>
              <p className="text-sm mb-4">{comment.content}</p>
              {comment.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateStatus(comment.id, 'approved')}>通过</Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(comment.id, 'rejected')}>拒绝</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {comments.length === 0 && <p className="text-muted-foreground">暂无评论</p>}
      </div>
    </div>
  )
}
