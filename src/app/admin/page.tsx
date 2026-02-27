import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const runtime = 'edge'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: newsCount },
    { count: storiesCount },
    { count: pendingStoriesCount },
    { count: pendingCommentsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">管理后台</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">新闻总数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{newsCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">故事总数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{storiesCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待审核故事</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">{pendingStoriesCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待审核评论</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-500">{pendingCommentsCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">用户总数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{usersCount || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
