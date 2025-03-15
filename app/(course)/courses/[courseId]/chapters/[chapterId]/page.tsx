import {Banner} from "@/components/banner";
import {VideoPlayer} from "./_components/video-player";
import {CourseEnrollButton} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-enroll-button";
import Image from "next/image";
import OppsPageImageSrc from "@/public/opps-page.svg";
import {Separator} from "@/components/ui/separator";
import {Preview} from "@/components/preview";
import {File} from "lucide-react"
import { CourseProgressButton } from "./_components/course-progress-button";
import AssignmentIdPage from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/page";
import {useEffect, useState} from "react";
import axios from "axios";

const ChapterIdPage = ({
    params
}: {
    params: {courseId: string; chapterId: string}
}) => {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [nextChapter, setNextChapter] = useState<Chapter | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [muxData, setMuxData] = useState<MuxData | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [attachments, setAttachments] = useState<Attachment[] | []>([]);
    const [assignments, setAssignments] = useState<Assignment[] | []>([]);
    const [courseId, setCourseId] = useState('');
    const [chapterId, setChapterId] = useState('');

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

        const getUserProgress = async () => {
            if (!chapterId) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/progress`);
                setUserProgress(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        const getMuxData = async () => {
            if (!chapterId) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/video`);
                setMuxData(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        const getNextChapter = async () => {
            if (!chapter) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/next`);
                setNextChapter(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        const getEnrollment = async () => {
            if (!chapter) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/enrollment`);
                setEnrollment(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        const getAttachments = async () => {
            if (!chapter) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/attachments`);
                setAttachments(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        const getAssignments = async () => {
            if (!chapter) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments`);
                setAssignments(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        getChapter().then();
        getUserProgress().then();
        getMuxData().then();
        getNextChapter().then();
        getEnrollment().then();
        getAttachments().then();
        getAssignments().then();
    }, []);

    if (!chapter) return <div>Loading...</div>;

    const isLocked = !chapter.isFree;
    const completeOnEnd = !userProgress?.isCompleted;
    const hasAttachedVideo = muxData?.playbackId !== undefined;

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
                            <VideoPlayer
                                title={chapter.title}
                                courseId={courseId}
                                chapterId={chapterId}
                                nextChapterId={nextChapter?.id}
                                playbackId={muxData.playbackId!}
                                completeOnEnd={completeOnEnd}
                            />
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                            <h2 className="text-2xl font-semibold mb-2">
                                {chapter.title}
                            </h2>
                            {enrollment  ? (
                                <CourseProgressButton
                                    chapterId={chapterId}
                                    courseId={courseId}
                                    nextChapterId={nextChapter?.id}
                                    isCompleted={!!userProgress?.isCompleted}
                                />
                            ) : (
                                <CourseEnrollButton
                                    courseId={courseId}
                                />
                            )}
                        </div>
                        <Separator />
                        <div className="p-4">
                            <Preview value={chapter.description!}/>
                        </div>
                        {!!attachments.length && (
                            <>
                                <Separator />
                                <div className="px-4 pt-2 space-y-2 mt-4">
                                    {attachments.map((attachment) => (
                                        <a
                                            href={attachment.url}
                                            target="_blank"
                                            key={attachment.id}
                                            className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
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
                        {!!assignments.length && (
                            <>
                                <Separator/>
                                {assignments.map((assignment) =>
                                        assignment.isPublished && (
                                            <div key={assignment.id} className="w-full bg-slate-100 border-slate-200 border rounded-md">
                                                <AssignmentIdPage
                                                    courseId={courseId}
                                                    chapterId={chapterId}
                                                    assignment={assignment}
                                                />
                                            </div>
                                        )
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChapterIdPage;