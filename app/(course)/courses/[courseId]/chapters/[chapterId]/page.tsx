"use client";

import {Banner} from "@/components/banner";
import {CourseEnrollButton} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button";
import Image from "next/image";
import OppsPageImageSrc from "@/public/opps-page.svg";
import {Separator} from "@/components/ui/separator";
import {Preview} from "@/components/editor/preview";
import {File, LaptopMinimalCheck} from "lucide-react"
import { CourseProgressButton } from "./_components/course-progress-button";
import axios from "axios";
import ReactPlayer from "react-player";
import { useQuery } from "@tanstack/react-query";
import {ChapterSkeleton} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/chapter-skeleton";
import React from "react";
import Link from "next/link";
import {ErrorPage} from "@/components/opps-page";

const fetchChapter = async (courseId: string, chapterId: string): Promise<Chapter> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}`);
    return response.data.chapter;
};

const fetchUserProgress = async (courseId: string, chapterId: string) : Promise<UserChapterProgress | null> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/progress`);
    if (response.status === 204) return null;

    return response.data.userProgress ?? null;
};

const fetchNextChapter = async (courseId: string, chapterId: string): Promise<Chapter | null> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/next`);
    if (response.status === 204) return null;

    return response.data.nextChapter ?? null;
};

const fetchEnrollment = async (courseId: string): Promise<Enrollment | null> => {
    const response = await axios.get(`/api/courses/${courseId}/enroll`);
    if (response.status === 204) return null;

    return response.data.enrollment ?? null;
};

const fetchCourseAttachments = async (courseId: string): Promise<Attachment[]> => {
    const response = await axios.get(`/api/courses/${courseId}/attachments`);
    return response.data.attachments;
};

const fetchChapterAttachments = async (courseId: string, chapterId: string): Promise<Attachment[]> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/attachments`);
    return response.data.attachments;
};

const fetchAssignments = async (courseId: string, chapterId: string): Promise<Assignment[]> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments`);
    return response.data.assignments;
};

const ChapterIdPage = ({
                           params
                       }: {
    params: Promise<{ courseId: string, chapterId: string; }>;
}) => {
    const courseId = React.use(params).courseId;
    const chapterId = React.use(params).chapterId;

    const { data: enrollment, error: enrollmentError} = useQuery({
        queryKey: ["enrollment", courseId],
        queryFn: () => fetchEnrollment(courseId),
        enabled: !!courseId,
    });

    const { data: userProgress, error: userProgressError } = useQuery({
        queryKey: ["userProgress", courseId, chapterId],
        queryFn: () => fetchUserProgress(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    });

    const { data: chapter, error: chapterError, isLoading: isLoadingChapter } = useQuery({
        queryKey: ["chapter", courseId, chapterId],
        queryFn: () => fetchChapter(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    });

    const { data: courseAttachments, error: courseAttachmentsError } = useQuery({
        queryKey: ["course-attachments", courseId],
        queryFn: () => fetchCourseAttachments(courseId)?? [],
        enabled: !!courseId && !!chapterId,
    });

    const { data: chapterAttachments, error: chapterAttachmentsError } = useQuery({
        queryKey: ["attachments", courseId, chapterId],
        queryFn: () => fetchChapterAttachments(courseId, chapterId) ?? [],
        enabled: !!courseId && !!chapterId,
    });

    const { data: assignments, error: assignmentsError } = useQuery({
        queryKey: ["assignments", courseId, chapterId],
        queryFn: () => fetchAssignments(courseId, chapterId) ?? [],
        enabled: !!courseId && !!chapterId,
    });

    const { data: nextChapter, error: nextChapterError } = useQuery({
        queryKey: ["nextChapter", courseId, chapterId],
        queryFn: () => fetchNextChapter(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    });

    if (isLoadingChapter) return <ChapterSkeleton />;

    const hasError = [
        chapterError,
        enrollmentError,
        courseAttachmentsError,
        chapterAttachmentsError,
        assignmentsError,
        userProgressError,
        nextChapterError,
    ].some(Boolean);

    if (hasError) return <ErrorPage />;

    const isLocked = !chapter?.isFree;
    const hasAttachedVideo = chapter?.videoUrl !== undefined;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="Ви вже виконали всі завдання цього розділу."
                />
            )}
            {isLocked && (
                <>
                    <Banner
                        variant="warning"
                        label="Доступ до цього розділу обмежено."
                    />
                    <div className="md:pl-30 pt-[80px] flex flex-col items-center justify-center text-center">
                        <Image
                            src={OppsPageImageSrc}
                            alt="Відео недоступне"
                            width={400}
                            height={300}
                            className="max-w-full h-auto self-center"
                        />
                        <div className="text-center mt-10">
                            <h1 className="text-2xl font-bold uppercase">Цей розділ наразі недоступний.</h1>
                            <p className="mt-2 text-md text-muted-foreground">
                                Доступ може бути відкритий викладачем пізніше. Зверніться до викладача для деталей.
                            </p>
                        </div>
                    </div>
                </>
            )}
            {!isLocked && (
                <div className="flex flex-col max-w-4xl mx-auto pb-20">
                    <div className="p-4">
                        {hasAttachedVideo && (
                            <ReactPlayer
                                url={chapter.videoUrl}
                                controls
                                width="100%"
                                height="100%"
                                playing={false}
                            />
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 flex flex-col md:!flex-row items-center justify-between">
                            <h2 className="text-2xl font-semibold mb-2">
                                {chapter.title}
                            </h2>
                            {enrollment  ? (
                                <CourseProgressButton
                                    chapterId={chapterId}
                                    courseId={courseId}
                                    nextChapter={nextChapter}
                                    isCompleted={!!userProgress?.isCompleted}
                                />
                            ) : (
                                <CourseEnrollButton
                                    courseId={courseId}
                                />
                            )}
                        </div>
                        <Separator />
                        <div className="px-4">
                            <Preview value={chapter.description!}/>
                        </div>
                        {enrollment && !!assignments?.length && (
                            <>
                                <Separator/>
                                <div className="px-4 pt-2 space-y-2 mt-4">
                                    <h3 className="text-lg font-semibold mb-6">Завдання для самостійної роботи</h3>
                                    {assignments.map((assignment) =>
                                            assignment.isPublished && (
                                                <div
                                                    key={assignment.id}
                                                    className="pb-2 space-y-2"
                                                >
                                                    <Link
                                                        href={`/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}`}
                                                        aria-label="Виконати завдання"
                                                        className="flex items-center p-3 w-full bg-slate-100 hover:bg-slate-300 hover:text-gray-900 border border-slate-200 text-slate-700 rounded-md"
                                                    >
                                                        <LaptopMinimalCheck className="h-6 w-6 mr-2 flx-shrink-0"/>
                                                        <p className="text-md line-clamp-1">
                                                            {assignment.title}
                                                        </p>
                                                    </Link>
                                                </div>
                                            )
                                    )}
                                </div>
                            </>
                        )}
                        {enrollment && !!courseAttachments?.length && (
                            <>
                                <Separator />
                                <div className="px-4 pt-2 space-y-2 mt-4">
                                    <h3 className="text-lg font-semibold mb-6">Вкладення та супровідні файли</h3>
                                    {courseAttachments.map((attachment) => (
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            key={attachment.id}
                                            className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 hover:bg-sky-200/80 hover:text-sky-900 text-sky-700 rounded-md"
                                        >
                                            <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <p className="text-xs line-clamp-1">
                                                {attachment.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                        {enrollment && !!chapterAttachments?.length && (
                            <>
                                <div className="px-4 space-y-2">
                                    {chapterAttachments.map((attachment) => (
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            key={attachment.id}
                                            className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 hover:bg-sky-200/80 hover:text-sky-900 text-sky-700 rounded-md"
                                        >
                                            <File className="h-4 w-4 mr-2 flx-shrink-0"/>
                                            <p className="text-xs line-clamp-1">
                                                {attachment.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChapterIdPage;