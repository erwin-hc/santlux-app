import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTable() {
  return (
    <div className="w-full [&_div]:my-3 [&_div]:h-7 [&_div]:w-full [&_div]:px-5">
      <div>
        <Skeleton />
      </div>
      <div>
        <Skeleton />
      </div>
      <div>
        <Skeleton />
      </div>
      <div>
        <Skeleton />
      </div>
      <div>
        <Skeleton />
      </div>
    </div>
  );
}
