"use client";

import CourseSidebarItem from "@/app/(course)/courses/[courseId]/_components/course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import {CourseWithdrawButton} from "@/app/(course)/courses/[courseId]/_components/course-withdraw-button";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserChapterProgress | null;
        })[],
        isEnrolled: boolean;
    };
    progressCount: number;
}

export const CourseSidebar = ({
                                  course,
                                  progressCount,
                              }: CourseSidebarProps) => {
    return (
        <div className="h-full border-r border-gray-900/25 flex flex-col overflow-y-auto shadow-sm">
            <div className="flex flex-col border-b border-dashed border-gray-900/25">
                <h1 className="h-[80px] p-8 font-semibold">
                    {course.title}
                </h1>
                {progressCount > 0 && (
                    <div className="my-4 px-6">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full flex-grow">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree}
                    />
                ))}
            </div>
            {course.isEnrolled && (
                <div className="mt-auto p-4 flex justify-center">
                    <CourseWithdrawButton courseId={course.id} />
                </div>
            )}
        </div>
    );
};
export default CourseSidebar;