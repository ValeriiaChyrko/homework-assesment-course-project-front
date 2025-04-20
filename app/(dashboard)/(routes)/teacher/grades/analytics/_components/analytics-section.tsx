"use client";

import { AnalyticsCard } from "./analytics-card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ErrorPage } from "@/components/opps-page";
import {
    GradesDataTableSkeleton
} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/grades-table-skeleton";
import {GradesDataTable} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/grades-data-table";
import {columns} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/grades-columns";
import {StudentSearchInput} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/student-search-input";
import {
    EmptyAnalyticsResults
} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/empty-analytics-results";

interface AssignmentAnalytics {
    attempts:  {
        studentFullName: string;
        compilationScore: number;
        qualityScore: number;
        testsScore: number;
        finalScore: number;
    }[];

    assignmentTitle: string;
    averageScore: number;
    highestScore: number;
    successCoefficient: number;
}

interface AssignmentAnalyticsProps {
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const fetchAssignmentAnalytics = async (courseId: string, chapterId: string, assignmentId: string): Promise<AssignmentAnalytics> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/analytics`);
    return response.data.analytics || {
        attempts: [],
        assignmentTitle: "Немає даних",
        averageScore: 0,
        highestScore: 0,
        successCoefficient: 0,
    };
};

export const AnalyticsSection = ({ courseId, chapterId, assignmentId }: AssignmentAnalyticsProps) => {
    const { data: assignmentAnalytics, isLoading: isLoadingAssignmentAnalytics, isError: isErrorAssignmentAnalytics } = useQuery<AssignmentAnalytics>({
        queryKey: ["assignment_analytics", courseId, chapterId, assignmentId],
        queryFn: () => fetchAssignmentAnalytics(courseId, chapterId, assignmentId),
    });

    if (isLoadingAssignmentAnalytics) return <GradesDataTableSkeleton />;
    if (isErrorAssignmentAnalytics) return <ErrorPage />;
    if (!assignmentAnalytics || assignmentAnalytics.attempts.length === 0) return <EmptyAnalyticsResults />;

    const getSuccessVariant = (coefficient: number): "default" | "success" | "warning" | "danger" => {
        if (coefficient >= 83) return "success";
        if (coefficient >= 75) return "warning";
        return "danger";
    };

    return (
        <div className="rounded-lg shadow-lg border border-gray-200 px-6 py-4 space-y-4">
            <h2 className="mt-2 text-lg font-semibold text-center">
                {assignmentAnalytics.assignmentTitle}
            </h2>

            <div className="flex gap-x-4">
                <div className="flex-1">
                    <AnalyticsCard
                        value={`${assignmentAnalytics.averageScore}`}
                        label="Середній бал"
                        variant={getSuccessVariant(assignmentAnalytics.averageScore)}
                    />
                </div>
                <div className="flex-1">
                    <AnalyticsCard
                        value={`${assignmentAnalytics.highestScore}`}
                        label="Найвищий бал"
                        variant={getSuccessVariant(assignmentAnalytics.highestScore)}
                    />
                </div>
                <div className="flex-1">
                    <AnalyticsCard
                        value={`${assignmentAnalytics.successCoefficient}%`}
                        label="Коефіцієнт успішності"
                        variant={getSuccessVariant(assignmentAnalytics.successCoefficient)}
                    />
                </div>
            </div>

            <StudentSearchInput/>
            <GradesDataTable columns={columns} data={assignmentAnalytics.attempts} />
        </div>
    );
};