import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonDemo() {
  return (
    <div className="flex flex-col items-start gap-2 ml-4 mt-4">
      <Skeleton className="h-4 w-37.5" />
      <Skeleton className="h-4 w-31.25" />
    </div>
  );
}
