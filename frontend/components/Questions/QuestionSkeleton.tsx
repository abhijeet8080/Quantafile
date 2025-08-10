import { Skeleton } from "@/components/ui/skeleton";

export function QuestionSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/70 backdrop-blur-md border border-purple-300 dark:border-purple-700 animate-pulse space-y-4 shadow-sm">
      <Skeleton className="h-7 w-1/2 rounded-lg" />
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-5 w-1/3 rounded-md" />
      <div className="flex gap-3">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  );
}
