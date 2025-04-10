"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const ThemeToggleButton = () => {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setIsDark(theme === "dark");
    }, [theme]);

    if (!mounted) return null;

    const toggleTheme = (checked: boolean) => {
        setTheme(checked ? "dark" : "light");
        setIsDark(checked);
    };

    const handleIconClick = () => {
        toggleTheme(!isDark);
    };

    return (
        <div
            className={cn(
                "relative flex items-center justify-center gap-2 border border-gray-900/25 rounded-full px-2 py-1 cursor-pointer transition-colors duration-300 ease-in-out",
                isDark ? "bg-primary" : "bg-white hover:bg-primary/90"
            )}
        >
            <div className="relative flex items-center justify-center w-6 h-6">
                <Sun
                    onClick={handleIconClick}
                    className={cn(
                        "absolute h-4 w-4 transition-all duration-300",
                        isDark
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                    )}
                />
                <Moon
                    onClick={handleIconClick}
                    className={cn(
                        "absolute h-4 w-4 transition-all duration-300",
                        !isDark
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2 pointer-events-none"
                    )}
                />
            </div>
        </div>
    );
};