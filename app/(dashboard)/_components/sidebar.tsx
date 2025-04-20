"use client";

import { Logo } from "./logo";
import {SidebarRoutes} from "./sidebar-routes";
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

export const Sidebar = () => {
    const { theme } = useTheme();

    return (
        <div className={cn(
            "h-full w-full border-r flex-col overflow-y-auto shadow-sm",
            theme === "dark" ? "bg-slate-900 border-gray-50 transition-colors duration-300" : "bg-white border-gray-900/25"
        )}>
            <div className="px-8 py-1">
                <Logo />
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    )
}