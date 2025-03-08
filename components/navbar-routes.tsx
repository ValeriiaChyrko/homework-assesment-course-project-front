"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";
import Logout from "@/app/(auth)/_components/logout";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import axios from "axios";
import { UserAvatar } from "@/app/(dashboard)/(routes)/(root)/_components/user-avatar";

export const NavbarRoutes = () => {
    const pathname = usePathname();
    const [isTeacher, setIsTeacher] = useState(false);

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursesPage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const response = await axios.get('/api/users');
                setIsTeacher(response.data);
            } catch (error) {
                console.error("Error fetching user role:", error);
                setIsTeacher(false);
            }
        };

        checkUserRole();
    }, []);

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursesPage ? (
                    <Link href="/">
                        <Button size="sm" variant="ghost">
                            <Home className="h-4 w-4 mr-1" />
                            На головну
                        </Button>
                    </Link>
                ) : isTeacher ? (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Режим викладача
                        </Button>
                    </Link>
                ) : null}
                <Logout />
                <UserAvatar />
            </div>
        </>
    );
};