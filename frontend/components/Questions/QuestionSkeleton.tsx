// components/question-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function QuestionSkeleton() {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <Skeleton className="h-6 w-1/2" /> 
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" /> 
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}
