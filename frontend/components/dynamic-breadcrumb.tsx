"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "./ui/separator";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Divide a URL em partes e remove itens vazios
  const pathSegments = pathname.split("/").filter((item) => item !== "");
  const isMobile = useIsMobile();

  return (
    <Breadcrumb>
      {!isMobile && (
        <BreadcrumbList>
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;

            const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

            return (
              <React.Fragment key={href}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="p-1 rounded-lg custom-ring" href={href}>
                      {label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      )}
    </Breadcrumb>
  );
}
