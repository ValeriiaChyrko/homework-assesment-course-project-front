"use client"
import {
    BarChart,
    ChartColumn,
    ChevronDown,
    ChevronRight,
    Compass,
    Layout,
    List,
    LucideIcon,
    Notebook
} from "lucide-react";
import {SidebarItem} from "./sidebar-item";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {cn} from "@/lib/utils";

type RouteItem = {
    icon: LucideIcon;
    label: string;
    href?: string;
    children?: {
        icon: LucideIcon;
        label: string;
        href: string;
    }[];
};

const guestRoutes: RouteItem[] = [
    {
        icon: Layout,
        label: 'Мої курси',
        href: '/',
    },
    {
        icon: Compass,
        label: 'Пошук',
        href: '/search',
    }
]

const teacherRoutes: RouteItem[] = [
    {
        icon: List,
        label: 'Курси',
        href: '/teacher/courses',
    },
    {
        icon: BarChart,
        label: 'Аналітика',
        children: [
            {
                icon: ChartColumn,
                label: 'Динаміка підписок',
                href: '/teacher/enrollments/analytics',
            },
            {
                icon: Notebook,
                label: 'Статистика успішності',
                href: '/teacher/grades/analytics',
            },
        ],
    }
];

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => {
                if (route.children) {
                    const isActiveChild = route.children.some(child => pathname === child.href);
                    const isOpen = openMenus[route.label] || isActiveChild;

                    return (
                        <div key={route.label} className="flex flex-col">
                            <button
                                onClick={() => toggleMenu(route.label)}
                                type="button"
                                aria-label={`Пункт меню ${route.label}`}
                                className={cn(
                                    "pr-2 cursor-pointer flex items-center justify-between text-slate-500 text-sm font-[500] pl-6 transition-all " +
                                    "hover:text-slate-600 hover:bg-slate-300/20",
                                    isActiveChild && "bg-slate-50 text-sky-700"
                                )}>
                                <div className="flex items-center gap-x-2 py-4">
                                    {route.icon && (
                                        <route.icon
                                            className={cn(
                                                "text-slate-500",
                                                isActiveChild && "text-sky-700",
                                            )}
                                        />
                                    )}
                                    {route.label}
                                </div>
                                <div className="flex items-center">
                                    {isOpen ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </div>
                            </button>

                            {isOpen && (
                                <div className="pl-6 flex flex-col gap-1">
                                    {route.children.map((child) => {
                                        return (
                                            <SidebarItem
                                                key={child.href}
                                                size="sm"
                                                icon={child.icon}
                                                iconSize={18}
                                                label={child.label}
                                                href={child.href}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <SidebarItem
                        key={route.href}
                        icon={route.icon}
                        label={route.label}
                        href={route.href!}
                    />
                );
            })}
        </div>
    );
};