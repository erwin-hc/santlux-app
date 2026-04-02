import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonTableRomaneio() {
  return (
    <div className="w-full mt-2 [&_div]:my-[8px] [&_div]:h-7 [&_div]:w-full [&_div]:px-5">
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
