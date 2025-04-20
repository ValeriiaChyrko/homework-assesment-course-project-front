"use client";

import {LucideIcon} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";

import {cn} from "@/lib/utils";

interface SidebarItemProps {
    size? :  "sm" | "md";
    icon: LucideIcon;
    iconSize?: number;
    label: string;
    href: string;
}

export const SidebarItem = ({
    size = "md",
    icon: Icon,
    iconSize = 22,
    label,
    href
}: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const sizeClass = {
        sm: "pl-4 text-xs",
        md: "pl-6 text-sm",
    };

    const onClick = () => {
        router.push(href);
    }

    return (
        <button
        onClick={onClick}
        type="button"
        aria-label={`Пункт меню ${label}`}
        className={cn(
            "cursor-pointer flex items-center gap-x-2 text-slate-500 font-[500]  transition-all " +
            "hover:text-slate-600 hover:bg-slate-300/20",
            isActive && "cursor-default text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700",
            sizeClass[size]
        )}>
            <div className="flex items-center gap-x-2 py-4">
                <Icon
                size={iconSize}
                className={cn(
                    "text-slate-500",
                    isActive && "text-sky-700",
                )}/>
                {label}
            </div>
            <div className={cn(
                    "ml-auto border-2 border-sky-700 h-full flex-none transition-all",
                    isActive ? "opacity-100 min-h-[45px]" : "opacity-0"
                )}
            />
        </button>
    )
}