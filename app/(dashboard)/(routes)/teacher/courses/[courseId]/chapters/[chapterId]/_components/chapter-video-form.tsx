"use client"

import * as z from "zod";
import axios from "axios";

import {Button} from "@/components/ui/button";
import {PencilIcon, PlusCircle, Video} from "lucide-react";
import {useCallback, useState} from "react";
import toast from "react-hot-toast";
import {FileUpload} from "@/components/file-upload";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ReactPlayer from "react-player";

interface VideoFormProps {
    initialData: {
        videoUrl?: string;
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().trim().min(1, {
        message: "Необхідно прикріпити відео.",
    }),
});

const ChapterVideoForm= ({ initialData, courseId, chapterId }: VideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: initialData.videoUrl || '',
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            await queryClient.invalidateQueries({ queryKey: ["chapter", courseId, chapterId] });
            toggleEditing();
            toast.success("Дані оновлено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    };

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Відеофайл курсу
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Прикріпити відео"}
                >
                    {isEditing ? "Скасувати" : !isEditing && !initialData.videoUrl ? (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Прикріпити відео
                        </>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити відео
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
                        <Video className="h-10 w-10 text-slate-500"/>
                    </div>
                ) : (
                    <div className="relative aspect-video mt-4">
                        <ReactPlayer
                            url={initialData.videoUrl}
                            controls
                            width="100%"
                            height="100%"
                            playing={false}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChangeAction={(url?: string) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-sm text-muted-foreground mt-4">
                        Прикріпіть відео до цього розділу, щоб надати додаткову інформацію та візуальні матеріали.
                    </div>
                </div>
            )}
            {!isEditing && initialData.videoUrl && (
                <div className="text-xs text-muted-foreground mt-4">
                    Обробка відео може тривати кілька хвилин. Якщо відео не відображається, будь ласка, оновіть сторінку.
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm;