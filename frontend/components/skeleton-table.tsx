import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTable() {
  return (
    <div className="w-full my-3.25">
      <div className="grow my-2.5">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2.5">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2.5">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2.5">
        <Skeleton className="h-7 w-full" />
      </div>
      <div className="grow my-2.5">
        <Skeleton className="h-7 w-full" />
      </div>
    </div>
  );
}
