"use client";

import AssignmentHeader from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-header";
import AssignmentInformation from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-information";
import AssignmentReviewResults from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-review-results";
import AssignmentSolution from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-solution";
import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
    AssignmentSkeleton
} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-skeleton";

const fetchAssignment = async (courseId: string, chapterId: string, assignmentId: string): Promise<Assignment | null> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`);
    return response.data;
};

const fetchAllUserAttempts = async (courseId: string, chapterId: string, assignmentId: string): Promise<Attempt[] | null> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts`);
    return response.data;
};

const fetchUserAttemptProgress = async (courseId: string, chapterId: string, assignmentId: string): Promise<UserAssignmentProgress | null> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/progress`);
    return response.data;
};

const AssignmentIdPage = ({
                              params
                          }: {
    params: Promise<{ courseId: string, chapterId: string; assignmentId: string; }>;
}) => {
    const courseId = React.use(params).courseId;
    const chapterId = React.use(params).chapterId;
    const assignmentId = React.use(params).assignmentId;

    const { data: assignment, isLoading: isLoadingAssignment } = useQuery({
        queryKey: ["assignment", courseId, chapterId, assignmentId],
        queryFn: () => fetchAssignment(courseId, chapterId, assignmentId),
        enabled: !!courseId && !!chapterId && !!assignmentId,
    });

    const { data: attempts } = useQuery({
        queryKey: ["attempts", courseId, chapterId, assignmentId],
        queryFn: () => fetchAllUserAttempts(courseId, chapterId, assignmentId),
        enabled: !!courseId && !!chapterId && !!assignmentId,
    });

    const lastAttempt: Attempt | null = attempts?.length ? attempts[0] : null;

    const { data: progress } = useQuery({
        queryKey: ["attemptProgress", courseId, chapterId, assignmentId],
        queryFn: () => fetchUserAttemptProgress(courseId, chapterId, assignmentId),
        enabled: !!courseId && !!chapterId && !!assignmentId,
    });

    if (isLoadingAssignment || !assignment) return <AssignmentSkeleton />;

    const isLocked = !assignment ||
        new Date() > new Date(assignment.deadline) ||
        !!(lastAttempt && lastAttempt.position >= assignment.maxAttemptsAmount);

    return (
        <div className="pb-10">
            <div className="p-6">
                <Link href={`/courses/${courseId}/chapters/${chapterId}`} className="flex items-center text-md hover:opacity-75 transition mb-6 text-slate-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад до розділу
                </Link>
            </div>
            <div className="flex flex-col max-w-4xl mx-auto mb-20 bg-gray-100 rounded-md">
                <div className="space-y-2 mb-4">
                    <AssignmentHeader
                        courseId={courseId}
                        chapterId={chapterId}
                        assignment={assignment}
                        attempt={lastAttempt}
                        progress={progress}
                    />
                    <AssignmentInformation
                        assignmentRepositoryUrl={assignment.repositoryUrl!}
                        lastAttemptProgressStatus="started"
                        deadline={assignment.deadline}
                        assignmentMaxScore={assignment.maxScore}
                        assignmentDescription={assignment.description!}
                    />
                    {lastAttempt && !isLocked && !progress?.isCompleted && (
                        <AssignmentSolution
                            courseId={courseId}
                            chapterId={chapterId}
                            assignment={assignment}
                            attempt={lastAttempt}
                            isLocked={isLocked}
                        />
                    )}
                    {lastAttempt && lastAttempt.isCompleted && (
                        <AssignmentReviewResults
                            assignment={assignment}
                            attemptList={attempts || []}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentIdPage;