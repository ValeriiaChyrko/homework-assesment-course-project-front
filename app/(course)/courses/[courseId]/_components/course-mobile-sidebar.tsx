import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import CourseSidebar from "@/app/(course)/courses/[courseId]/_components/course-sidebar";
import {VisuallyHidden} from "@radix-ui/react-visually-hidden";

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
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
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