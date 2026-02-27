'use client'

import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
}

export function ShareButton({ title }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('链接已复制')
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4" />
    </Button>
  )
}
