"use client";

import {
    LayoutDashboard,
    CalendarClock,
    Github,
    Presentation,
    ArrowLeft
} from "lucide-react";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import AssignmentTitleForm from "./_components/assignment-title-form";
import AssignmentDescriptionForm from "./_components/assignment-description-form";
import AssignmentGithubRepoUrlForm from "./_components/assignment-github-repo-url-form";
import AssignmentDeadlineForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-deadline-form";
import AssignmentTestCriteriaForm from "./_components/assignment-test-criteria-form";
import { AssignmentActions } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-actions";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Link from "next/link";
import {
    EditAssignmentSkeleton
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/edit-assignment-skeleton";
import {ErrorPage} from "@/components/opps-page";

const fetchAssignment = async (courseId:string, chapterId:string, assignmentId:string) => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`);
    return response.data.assignment;
};

const AssignmentIdPage = ({ params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId:string }> })  => {
    const { courseId, chapterId, assignmentId } = React.use(params);

    const { data: assignment, error: assignmentError, isLoading } = useQuery({
        queryKey: ["assignment", courseId, chapterId, assignmentId],
        queryFn: () => fetchAssignment(courseId, chapterId, assignmentId),
        enabled: !!courseId && !!chapterId && !!assignmentId,
    });

    if (isLoading) return <EditAssignmentSkeleton/>;
    if (assignmentError) return <ErrorPage />;
    if (!assignment) return null;

    const requiredFields = [
        assignment.title,
        assignment.description,
        assignment.repositoryName,
        assignment.repositoryOwner,
        assignment.deadline
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!assignment.isPublished && (
                <Banner variant="warning" label="Цей завдання ще не опубліковано. Воно не буде відображатися в розділі." />
            )}
            <div className="p-6">
                <Link href={`/teacher/courses/${courseId}/chapters/${chapterId}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Повернутись до налаштувань розділу
                </Link>
                <div className="flex flex-col sm:!flex-row items-start md:items-center justify-between gap-y-4 space-x-2">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-3xl font-medium">Налаштування завдання розділу</h1>
                        <span className="text-md text-slate-700">
                                Завершіть заповнення всіх полів ({completedFields}/{totalFields})
                            </span>
                    </div>
                    <AssignmentActions
                        disabled={!isComplete}
                        courseId={courseId}
                        chapterId={chapterId}
                        assignmentId={assignmentId}
                        isPublished={assignment.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">Персоналізуйте своє завдання</h2>
                            </div>
                            <AssignmentTitleForm initialData={assignment} courseId={courseId} chapterId={chapterId} assignmentId={assignmentId} />
                            <AssignmentDescriptionForm initialData={assignment} courseId={courseId} chapterId={chapterId} assignmentId={assignmentId} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Github} />
                                <h2 className="text-xl">Налаштування GitHub</h2>
                            </div>
                            <AssignmentGithubRepoUrlForm initialData={assignment} courseId={courseId} chapterId={chapterId} assignmentId={assignmentId} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CalendarClock} />
                                <h2 className="text-xl">Термін здачі</h2>
                            </div>
                            <AssignmentDeadlineForm initialData={assignment} courseId={courseId} chapterId={chapterId} assignmentId={assignmentId} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Presentation} />
                                <h2 className="text-xl">Управління балами та спробами</h2>
                            </div>
                            <AssignmentTestCriteriaForm initialData={assignment} courseId={courseId} chapterId={chapterId} assignmentId={assignmentId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AssignmentIdPage;