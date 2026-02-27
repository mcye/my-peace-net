'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Profile {
  id: string
  username: string | null
  is_banned: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
  }

  const toggleBan = async (id: string, isBanned: boolean) => {
    await supabase.from('profiles').update({
      is_banned: !isBanned,
      banned_at: !isBanned ? new Date().toISOString() : null,
    }).eq('id', id)
    toast.success(!isBanned ? '已封禁' : '已解封')
    fetchUsers()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username || '未设置用户名'}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              <Button
                variant={user.is_banned ? 'default' : 'destructive'}
                size="sm"
                onClick={() => toggleBan(user.id, user.is_banned)}
              >
                {user.is_banned ? '解封' : '封禁'}
              </Button>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && <p className="text-muted-foreground">暂无用户</p>}
      </div>
    </div>
  )
}
