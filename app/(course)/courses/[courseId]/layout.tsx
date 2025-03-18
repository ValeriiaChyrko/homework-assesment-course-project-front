"use client";

import CourseSidebar from "@/app/(course)/courses/[courseId]/_components/course-sidebar";
import CourseNavbar from "@/app/(course)/courses/[courseId]/_components/course-navbar";
import { useEffect, useState } from "react";
import axios from "axios";

const CourseLayout = ({
                          children,
                          params
                      }: {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}) => {
    const [course, setCourse] = useState<Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[] | null;
    } | null>(null);
    const [progressCount, setProgressCount] = useState(0);

    useEffect(() => {
        const getCourseWithProgressAndChapters = async () => {
            try {
                const { courseId } = await params;
                const response = await axios.get(`/api/courses/${courseId}/progress`);
                const data = response.data;
                setCourse(data.course || null);
                setProgressCount(data.progressCount || 0);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        getCourseWithProgressAndChapters();
    }, [params]);

    if (!course) return <div>Loading...</div>;

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    );
}

export default CourseLayout;