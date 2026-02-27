import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Peace Net. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
              关于我们
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              隐私政策
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
