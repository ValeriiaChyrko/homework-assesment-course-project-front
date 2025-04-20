"use client";

import {NavbarRoutes} from "@/components/navbar-routes";
import CourseMobileSidebar from "@/app/(course)/courses/[courseId]/_components/course-mobile-sidebar";
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserChapterProgress | null;
        })[],
        isEnrolled: boolean;
    };
    progressCount: number;
}

const CourseNavbar = ({
    course,
    progressCount,
}: CourseNavbarProps) => {
    const { theme } = useTheme();

    return(
        <div className={cn(
            "p-4 border-b h-full flex items-center shadow-sm",
            theme === "dark" ? "bg-slate-900 border-gray-50 transition-colors duration-300 " : "bg-white border-gray-900/25 "
        )}>
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}

export default CourseNavbar;