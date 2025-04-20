"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CourseSidebar from "@/app/(course)/courses/[courseId]/_components/course-sidebar";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";
import {cn} from "@/lib/utils";
import {useTheme} from "next-themes";

interface CourseMobileSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserChapterProgress | null;
        })[],
        isEnrolled: boolean;
    };
    progressCount: number;
}

const CourseMobileSidebar = ({
                                 course,
                                 progressCount
                             }: CourseMobileSidebarProps) => {
    const { theme } = useTheme();

    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left"
                          className={cn(
                              "p-0",
                              theme === "dark" ? "bg-slate-900 border-gray-50 transition-colors duration-300 " : "bg-white border-gray-900/25 "
                          )}>
                <SheetTitle>
                    <VisuallyHidden>Список розділів курсу</VisuallyHidden>
                </SheetTitle>
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </SheetContent>
        </Sheet>
    );
}

export default CourseMobileSidebar;