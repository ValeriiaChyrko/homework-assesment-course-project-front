import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
          "grade-a": "border-transparent bg-emerald-50 text-emerald-800", // 91-100
          "grade-b": "border-transparent bg-lime-50 text-lime-800", // 83-90
          "grade-c": "border-transparent bg-yellow-50 text-yellow-800", // 76-82
          "grade-d": "border-transparent bg-orange-50 text-orange-800", // 68-75
          "grade-e": "border-transparent bg-rose-50 text-rose-700", // 61-67
          "grade-f": "border-transparent bg-red-50 text-red-800", // 0-60
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
