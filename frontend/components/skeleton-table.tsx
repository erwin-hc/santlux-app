import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTable() {
  return (
    <div className="w-full space-y-4 mb-1 mt-1.5">
      <div className="grow my-2">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow space-y-1">
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
}
