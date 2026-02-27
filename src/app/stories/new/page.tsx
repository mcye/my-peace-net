'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

export default function NewStoryPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('请先登录')
      return
    }

    setLoading(true)
    const excerpt = content.slice(0, 200)

    const { error } = await supabase.from('stories').insert({
      user_id: user.id,
      title,
      content,
      excerpt,
    })

    if (error) {
      toast.error('提交失败')
    } else {
      toast.success('故事已提交，等待审核')
      router.push('/stories')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">请先登录后再分享故事</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>分享你的故事</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="写下你的故事..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? '提交中...' : '提交故事'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
