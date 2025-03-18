"use client";

import { CoursesList } from "@/components/couses-list";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import { useEffect, useState } from "react";
import axios from "axios";
import {CoursesListSkeleton} from "@/components/course-list-skeleton";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [completedCourses, setCompletedCourses] = useState([]);
    const [coursesInProgress, setCoursesInProgress] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCoursesWithProgressAndCategory = async () => {
            try {
                const response = await axios.get('/api/courses/progress');
                const data = response.data;
                setCompletedCourses(data.completedCourses || []);
                setCoursesInProgress(data.coursesInProgress || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Не вдалося завантажити курси. Спробуйте ще раз.");
            } finally {
                setIsLoading(false);
            }
        };

        getCoursesWithProgressAndCategory();
    }, []);

    return (
        <div className="p-6 space-y-4">
            {isLoading ? (
                <CoursesListSkeleton />
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
                    <CoursesList items={[...coursesInProgress, ...completedCourses]} displayProgress={true}/>
                </>
            )}
        </div>
    );
}