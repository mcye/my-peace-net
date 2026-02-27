'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditNewsPage({ params }: Props) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      fetchNews(id)
    })
  }, [params])

  const fetchNews = async (newsId: string) => {
    const { data } = await supabase.from('news').select('*').eq('id', newsId).single()
    if (data) {
      setTitle(data.title)
      setSlug(data.slug)
      setContent(data.content)
      setStatus(data.status)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const excerpt = content.slice(0, 200)
    const { error } = await supabase.from('news').update({
      title, slug, content, excerpt, status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    }).eq('id', id)

    if (error) {
      toast.error('保存失败')
    } else {
      toast.success('已保存')
      router.push('/admin/news')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">编辑新闻</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        <Textarea placeholder="内容" value={content} onChange={(e) => setContent(e.target.value)} rows={15} required />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="archived">已归档</option>
        </select>
        <div>
          <Button type="submit" disabled={loading}>{loading ? '保存中...' : '保存'}</Button>
        </div>
      </form>
    </div>
  )
}
