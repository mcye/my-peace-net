import { Skeleton } from '@/components/ui/skeleton'

export default function StoryDetailLoading() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <Skeleton className="h-9 w-3/4 mb-4" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-b">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>

      <div className="mt-8 space-y-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-24 w-full" />
      </div>
    </article>
  )
}
