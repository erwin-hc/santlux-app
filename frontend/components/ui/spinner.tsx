import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <>
      <Loader variant="orbit" size="xl" color="muted" />
    </>
  );
}

export { Spinner };
