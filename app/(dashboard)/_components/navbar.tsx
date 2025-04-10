"use client";

import { cn } from "@/lib/utils";
import {MobileSidebar} from "./mobile-sidebar";
import {NavbarRoutes} from "@/components/navbar-routes";
import {useTheme} from "next-themes";

export const Navbar = () => {
    const { theme } = useTheme();

    return (
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            theme === "dark" ? "bg-slate-900 border-gray-50 transition-colors duration-300 " : "bg-white border-gray-900/25 "
        )}>
            <MobileSidebar />
            <NavbarRoutes />
        </div>
    )
}