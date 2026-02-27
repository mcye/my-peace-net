'use client'

export const runtime = 'edge'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

export default function NewNewsPage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const excerpt = content.slice(0, 200)
    const { error } = await supabase.from('news').insert({
      title,
      slug,
      content,
      excerpt,
      author_id: user.id,
      status: 'published',
      published_at: new Date().toISOString(),
    })

    if (error) {
      toast.error('发布失败')
    } else {
      toast.success('发布成功')
      router.push('/admin/news')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">发布新闻</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="URL Slug (如: my-news-title)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <Textarea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? '发布中...' : '发布'}
        </Button>
      </form>
    </div>
  )
}
