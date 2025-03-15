"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Eye,
    LaptopMinimalCheck,
    LayoutDashboard,
    Video
} from "lucide-react";
import {IconBadge} from "@/components/icon-badge";
import ChapterTitleForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-title-form";
import ChapterDescriptionForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import ChapterAccessForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-access-form";
import ChapterVideoForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-video-form";
import {Banner} from "@/components/banner";
import {
    ChapterActions
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-actions";
import AssignmentsForm
    from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/assignments-form";
import {useEffect, useState} from "react";
import axios from "axios";

const ChapterIdPage = ({ params }: { params: Promise<{ courseId: string, chapterId: string }> }) => {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [courseId, setCourseId] = useState<string>('');
    const [chapterId, setChapterId] = useState<string>('');

    useEffect(() => {
        const getChapter = async () => {
            const {courseId, chapterId} = await params;
            setChapterId(chapterId);
            setCourseId(courseId);

            if (!courseId) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}`);
                setChapter(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        getChapter();
    }, [params]);

    if (!chapter) return null;

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.assignments.some((assignment: Assignment) => assignment.isPublished)
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="Цей розділ ще не опублікований. Він не буде відображатися в курсі."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Повернутись до налаштувань курсу
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Налаштування розділу курсу
                                </h1>
                                <span className="text-sm text-slate-700">
                                    Завершіть заповнення всіх полів {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={courseId}
                                chapterId={chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Персоналізуйте свій розділ
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">
                                    Налаштування доступу
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl">
                                    Мультимедійні матеріали
                                </h2>
                            </div>
                            <ChapterVideoForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LaptopMinimalCheck}/>
                                <h2 className="text-xl">
                                    Завдання для самостійної роботи
                                </h2>
                            </div>
                            <AssignmentsForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChapterIdPage;