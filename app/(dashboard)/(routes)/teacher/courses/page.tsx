"use client";

import axios from "axios";
import { DataCard } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import { GraduationCap, School } from "lucide-react";
import { CourseTable } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/course-data-table";
import { useQuery } from "@tanstack/react-query";
import {Chart} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/chart";

const fetchCourseAnalytics = async () => {
    const response = await axios.get('/api/courses/evaluation');
    return {
        courses: response.data.courses,
        totalAttempts: response.data.totalAttempts,
    };
};

const fetchEnrolledCourseAnalytics = async () => {
    const response = await axios.get('/api/courses/enrollments');
    return {
        enrolledCourses: response.data.enrolledCourses,
        totalStudents: response.data.totalStudents,
    };
};

const AnalyticsPage = () => {
    const { data: courseAnalytics, isLoading: isLoadingCourses, isError: isErrorCourses } = useQuery({
        queryKey: ["course_analytics"],
        queryFn: fetchCourseAnalytics,
    });

    const { data: enrollmentAnalytics, isLoading: isLoadingEnrollments, isError: isErrorEnrollments } = useQuery({
        queryKey: ["enrollment_analytics"],
        queryFn: fetchEnrolledCourseAnalytics,
    });

    if (isLoadingCourses || isLoadingEnrollments) {
        return <div>Loading...</div>;
    }

    if (isErrorCourses || isErrorEnrollments) {
        return <p>Error fetching data.</p>;
    }

    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <DataCard
                    value={enrollmentAnalytics?.totalStudents ?? 0}
                    label="Загальна кількість студентів"
                    icon={GraduationCap}
                />
            </div>
            <Chart
                data={enrollmentAnalytics?.enrolledCourses ?? []}
            />
            <DataCard
                value={courseAnalytics?.totalAttempts ?? 0}
                label="Статистика активності студентів"
                icon={School}
            />
            <CourseTable
                courses={courseAnalytics?.courses ?? []}
            />
        </div>
    );
};

export default AnalyticsPage;