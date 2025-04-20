"use client";

import axios from "axios";
import { DataCard } from "@/app/(dashboard)/(routes)/teacher/enrollments/analytics/_components/data-card";
import { GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {Chart} from "@/app/(dashboard)/(routes)/teacher/enrollments/analytics/_components/chart";
import {EnrollmentsAnalysisSkeleton} from "@/app/(dashboard)/(routes)/teacher/enrollments/analytics/_components/enrollments-analysis-skeleton";
import {ErrorPage} from "@/components/opps-page";

interface EnrollmentsAnalytics {
    analysis: {
        courseId: string;
        courseTitle: string;
        enrollmentsAmount: number;
    }[];
    totalStudents: number;
}

const fetchEnrollmentsAnalytics = async (): Promise<EnrollmentsAnalytics> => {
    const response = await axios.get('/api/courses/owned/enrollments');
    return response.data.analytics;
};

const AnalyticsPage = () => {
    const { data: enrollmentAnalytics, isLoading: isLoadingCourses, isError: isErrorCourses } = useQuery<EnrollmentsAnalytics>({
        queryKey: ["enrollment_analytics"],
        queryFn: fetchEnrollmentsAnalytics,
    });

    if (isLoadingCourses) return <EnrollmentsAnalysisSkeleton />;
    if (isErrorCourses) return <ErrorPage />;

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col gap-x-4 mb-4">
                <DataCard
                    value={enrollmentAnalytics?.totalStudents ?? 0}
                    label="Загальна кількість студентів"
                    icon={GraduationCap}
                />
            </div>
            <Chart
                data={(enrollmentAnalytics?.analysis ?? []).map(item => ({
                    title: item.courseTitle,
                    total: item.enrollmentsAmount
                }))}
            />
        </div>
    );
};

export default AnalyticsPage;