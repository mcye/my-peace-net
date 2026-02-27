import { Skeleton } from '@/components/ui/skeleton'

export function SocialButtonsSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-t border-b">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
    </div>
  )
}

export function CommentsSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  )
}
