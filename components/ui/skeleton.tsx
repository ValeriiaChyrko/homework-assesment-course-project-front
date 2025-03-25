import { cn } from "@/lib/utils"
import React from "react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gray-100 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
