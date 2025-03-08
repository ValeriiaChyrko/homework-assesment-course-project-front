"use client";

import {CoursesList} from "@/components/couses-list";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [completedCourses, setCompletedCourses] = useState([]);
    const [coursesInProgress, setCoursesInProgress] = useState([]);

    useEffect(() => {
        const getCoursesWithProgressAndCategory = async () => {
            try {
                const response = await axios.get('/api/courses/progress');
                const data = response.data;
                setCompletedCourses(data.completedCourses || []);
                setCoursesInProgress(data.coursesInProgress || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCompletedCourses([]);
                setCoursesInProgress([]);
            }
        };

        getCoursesWithProgressAndCategory();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    label="В процесі"
                    numbersOfItems={coursesInProgress.length}
                />
                <InfoCard
                    icon={CheckCircle}
                    label="Завершено"
                    numbersOfItems={completedCourses.length}
                    variant="success"
                />
            </div>
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    );
}