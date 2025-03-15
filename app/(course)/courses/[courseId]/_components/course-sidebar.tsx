"use client";

import CourseSidebarItem from "@/app/(course)/courses/[courseId]/_components/course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import {useEffect, useState} from "react";
import axios from "axios";

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[]
    };
    progressCount: number;
}

export const CourseSidebar = ({
    course,
    progressCount,
}: CourseSidebarProps) => {
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

    useEffect(() => {
        const getEnrollment = async () => {
            try {
                const response = await axios.get(`/api/courses/${course.id}/enrollment`);
                setEnrollment(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        getEnrollment().then();
    }, [course]);

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {enrollment && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree}
                    />
                ))}
            </div>
        </div>
    );
}

export default CourseSidebar;