'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Story {
  id: string
  title: string
  content: string
  status: string
  created_at: string
  profiles?: { username: string | null }
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    const { data: storiesData } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false })

    if (!storiesData) {
      setStories([])
      return
    }

    // 获取用户名
    const userIds = [...new Set(storiesData.map(s => s.user_id))]
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds)

    const profileMap = new Map(profilesData?.map(p => [p.id, p.username]) || [])

    setStories(storiesData.map(s => ({
      ...s,
      profiles: { username: profileMap.get(s.user_id) || null }
    })))
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('stories').update({ status }).eq('id', id)
    toast.success(status === 'approved' ? '已通过' : '已拒绝')
    fetchStories()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">故事审核</h1>
      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id}>
            <CardContent className="py-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{story.title}</h3>
                <span className={`text-sm ${story.status === 'pending' ? 'text-orange-500' : ''}`}>
                  {story.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {story.profiles?.username || '匿名'} · {new Date(story.created_at).toLocaleDateString('zh-CN')}
              </p>
              <p className="text-sm mb-4 line-clamp-3">{story.content}</p>
              {story.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateStatus(story.id, 'approved')}>通过</Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(story.id, 'rejected')}>拒绝</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {stories.length === 0 && <p className="text-muted-foreground">暂无故事</p>}
      </div>
    </div>
  )
}
