import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin')
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!admin) {
    redirect('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r p-4">
        <nav className="space-y-2">
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-muted">
            概览
          </Link>
          <Link href="/admin/news" className="block px-3 py-2 rounded hover:bg-muted">
            新闻管理
          </Link>
          <Link href="/admin/stories" className="block px-3 py-2 rounded hover:bg-muted">
            故事审核
          </Link>
          <Link href="/admin/comments" className="block px-3 py-2 rounded hover:bg-muted">
            评论审核
          </Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-muted">
            用户管理
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
