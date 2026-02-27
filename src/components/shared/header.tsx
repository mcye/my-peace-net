'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Peace Net
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/news" className="text-sm hover:text-primary">
            新闻
          </Link>
          <Link href="/stories" className="text-sm hover:text-primary">
            故事
          </Link>
          <Link href="/about" className="text-sm hover:text-primary">
            关于
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin">登录</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">注册</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
