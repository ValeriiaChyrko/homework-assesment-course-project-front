"use client";

import {LayoutDashboard, Eye, LaptopMinimalCheck, Video, ArrowLeft, File} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import ChapterTitleForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import ChapterDescriptionForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import ChapterAccessForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-access-form";
import ChapterVideoForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-video-form";
import AssignmentsForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/assignments-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-actions";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { EditChapterSkeleton } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/edit-chapter-skeleton";
import Link from "next/link";
import ChapterAttachmentForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-attachment-form";

const fetchChapter = async (courseId: string, chapterId: string): Promise<Chapter> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
};

const ChapterIdPage = ({ params }: { params: Promise<{ courseId: string, chapterId: string }> }) => {
    const { courseId, chapterId } = React.use(params);

    const { data: chapter, isLoading } = useQuery({
        queryKey: ["chapter", courseId, chapterId],
        queryFn: () => fetchChapter(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    });

    if (isLoading) return <EditChapterSkeleton />;
    if (!chapter) return null;

    const requiredFields = [
        !!chapter.title,
        !!chapter.description,
        chapter.assignments.some((assignment: Assignment) => assignment.isPublished)
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    const totalFields = requiredFields.length;
    const isComplete = completedFields === totalFields;

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="Цей розділ ще не опублікований. Він не буде відображатися в курсі."
                />
            )}
            <div className="p-6">
                <Link href={`/teacher/courses/${courseId}`}
                      className="flex items-center text-sm hover:opacity-75 transition mb-6 text-slate-600"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Повернутись до налаштувань курсу
                </Link>
                <div className="flex flex-col sm:!flex-row items-start md:items-center justify-between gap-y-4 space-x-2">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-3xl font-medium">Налаштування розділу курсу</h1>
                        <span className="text-md text-slate-700">
                                Завершіть заповнення всіх полів ({completedFields}/{totalFields})
                            </span>
                    </div>
                    <ChapterActions
                        disabled={!isComplete}
                        courseId={courseId}
                        chapterId={chapterId}
                        isPublished={chapter.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">Персоналізуйте свій розділ</h2>
                            </div>
                            <ChapterTitleForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                            <ChapterDescriptionForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">Мультимедійні матеріали</h2>
                            </div>
                            <ChapterVideoForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">Налаштування доступу</h2>
                            </div>
                            <ChapterAccessForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LaptopMinimalCheck} />
                                <h2 className="text-xl">Завдання для самостійної роботи</h2>
                            </div>
                            <AssignmentsForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">Вкладення та супровідні файли</h2>
                            </div>
                            <ChapterAttachmentForm initialData={chapter} courseId={courseId} chapterId={chapterId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;