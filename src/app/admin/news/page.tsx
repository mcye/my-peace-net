'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface News {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
    setNews(data || [])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除？')) return
    await supabase.from('news').delete().eq('id', id)
    toast.success('已删除')
    fetchNews()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">新闻管理</h1>
        <Button asChild>
          <Link href="/admin/news/new">发布新闻</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString('zh-CN')} · {item.status}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/news/${item.id}`}>编辑</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {news.length === 0 && <p className="text-muted-foreground">暂无新闻</p>}
      </div>
    </div>
  )
}
