"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ErrorPage } from "@/components/opps-page";
import AnalyticsForm from "./_components/analytics-form";
import { GradesAnalysisSkeleton } from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/grades-analysis-skeleton";
import { useState } from "react";
import { EmptyAnalyticsPlaceholder } from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/empty-analytics-placeholder";
import { AnalyticsSection } from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/analytics-section";

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
    const { data: enrollmentAnalytics, isLoading: isLoadingEnrollmentAnalytics, isError: isErrorEnrollmentAnalytics } = useQuery<EnrollmentsAnalytics>({
        queryKey: ["enrollment_analytics"],
        queryFn: fetchEnrollmentsAnalytics,
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [courseId, setCourseId] = useState<string | null>(null);
    const [chapterId, setChapterId] = useState<string | null>(null);
    const [assignmentId, setAssignmentId] = useState<string | null>(null);

    if (isLoadingEnrollmentAnalytics) return <GradesAnalysisSkeleton />;
    if (isErrorEnrollmentAnalytics || !enrollmentAnalytics) return <ErrorPage />;

    const handleSubmit = (formData: {
        courseId: string;
        chapterId: string;
        assignmentId: string;
    }) => {
        console.log("Форма надіслана з:", formData);
        setCourseId(formData.courseId);
        setChapterId(formData.chapterId);
        setAssignmentId(formData.assignmentId);
        setFormSubmitted(true);
    };

    return (
        <div className="p-6 flex flex-col md:!flex-row gap-6">
            <div className="md:w-1/4">
                {enrollmentAnalytics.analysis.length > 0 && (
                    <AnalyticsForm
                        courses={enrollmentAnalytics.analysis}
                        onSubmitAction={handleSubmit}
                    />
                )}
            </div>

            <div className="flex-grow">
                {formSubmitted && courseId && chapterId && assignmentId ? (
                    <AnalyticsSection courseId={courseId} chapterId={chapterId} assignmentId={assignmentId} />
                ) : (
                    <EmptyAnalyticsPlaceholder />
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;