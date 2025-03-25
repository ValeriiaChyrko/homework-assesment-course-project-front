"use client";

import { CoursesList } from "@/components/couses-list";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CoursesListSkeleton } from "@/components/course-list-skeleton";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number | null;
};

interface CoursesProgressResponse {
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
}

const fetchCoursesWithProgress = async (): Promise<CoursesProgressResponse> => {
    const response = await axios.get('/api/courses/progress');
    return response.data;
};

export default function Dashboard() {
    const { data, isLoading, isError } = useQuery<CoursesProgressResponse, Error>({
        queryKey: ["coursesProgress"],
        queryFn: fetchCoursesWithProgress
    });

    const completedCourses: CourseWithProgressWithCategory[] = data?.completedCourses || [];
    const coursesInProgress: CourseWithProgressWithCategory[] = data?.coursesInProgress || [];
    const userText = "В даний момент ви не розпочали проходження жодного курсу.";

    return (
        <div className="p-6 space-y-4">
            {isLoading ? (
                <CoursesListSkeleton />
            ) : isError ? (
                <p>Error fetching courses.</p>
            ) : (
                <>
                    <div className={`grid gap-4 ${completedCourses.length > 0 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                        <InfoCard
                            icon={Clock}
                            label="В процесі"
                            numbersOfItems={coursesInProgress.length}
                        />
                        {completedCourses.length > 0 && (
                            <InfoCard
                                icon={CheckCircle}
                                label="Завершено"
                                numbersOfItems={completedCourses.length}
                                variant="success"
                            />
                        )}
                    </div>
                    <CoursesList items={[...coursesInProgress, ...completedCourses]} userText={userText} />
                </>
            )}
        </div>
    );
}