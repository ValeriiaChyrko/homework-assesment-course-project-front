import {NavbarRoutes} from "@/components/navbar-routes";
import CourseMobileSidebar from "@/app/(course)/courses/[courseId]/_components/course-mobile-sidebar";

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
    return(
        <div className="p-4 border-b border-gray-900/25 h-full flex items-center shadow-sm transition-colors duration-300">
            <CourseMobileSidebar
                course={course}
                progressCount={progressCount}
            />
            <NavbarRoutes />
        </div>
    )
}

export default CourseNavbar;