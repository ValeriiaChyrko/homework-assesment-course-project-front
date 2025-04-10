"use client";

import CourseSidebar from "@/app/(course)/courses/[courseId]/_components/course-sidebar";
import CourseNavbar from "@/app/(course)/courses/[courseId]/_components/course-navbar";
import axios from "axios";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ChapterSkeleton } from "./chapters/[chapterId]/_components/chapter-skeleton";

type CourseWithProgressWithCategory = Course & {
    chapters: (Chapter & {
        userProgress: UserChapterProgress[] | null;
    })[];
    progressCount: number | null;
    isEnrolled: boolean;
};

const fetchCourseWithProgress = async (courseId: string): Promise<{ course: CourseWithProgressWithCategory; progressCount: number }> => {
    const response = await axios.get(`/api/courses/${courseId}/progress`);
    return {
        course: response.data.course,
        progressCount: response.data.progressCount,
    };
};

const CourseLayout = ({
                          children,
                          params,
                      }: {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}) => {
    const courseId = React.use(params).courseId;

    const { data, error, isLoading } = useQuery({
        queryKey: ["courseWithProgress", courseId],
        queryFn: () => {
            if (!courseId) throw new Error("Course ID is required");
            return fetchCourseWithProgress(courseId);
        },
        enabled: !!courseId,
    });

    if (isLoading) return <ChapterSkeleton />;
    if (error) return <p>Error loading course: {error.message}</p>;
    if (!data) return null;

    const { course, progressCount } = data;

    return (
        <div className="h-full bg-white dark:bg-gray-900">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount ?? 0}
                />
            </div>
            <div className="hidden md:!flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progressCount ?? 0}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    );
};

export default CourseLayout;