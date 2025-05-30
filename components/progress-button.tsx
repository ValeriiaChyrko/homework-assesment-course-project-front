import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-sky-200/70 text-sky-700 hover:bg-sky-300/80",
                started: "bg-indigo-200 text-indigo-700 hover:bg-indigo-300 hover:text-indigo-900",
                submitted: "bg-emerald-600/35 text-emerald-700 hover:bg-emerald-700/80 hover:text-slate-50",
                finished: "bg-purple-200 text-purple-700 hover:bg-purple-700/80 hover:text-slate-50",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const buttonTextMap: Record<string, string> = {
    'default': 'Розпочати',   // Завдання ще не розпочате
    'started': 'Подати роботу',  // Завдання розпочате, але не подане
    'submitted': 'Завершити',  // Робота подана, можна завершити
    'finished': 'Відновити',   // Завдання завершене, можна розпочати знову
};

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const ProgressButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        const buttonText = buttonTextMap[variant || 'default'];

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            >
                {buttonText}
            </Comp>
        )
    }
)
ProgressButton.displayName = "Button"

export { ProgressButton, buttonVariants }