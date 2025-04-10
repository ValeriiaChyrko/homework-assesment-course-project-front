"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FileUpload } from "@/components/file-upload";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface ChapterAttachmentFormProps {
    initialData: {
        attachments: Attachment[];
    };
    courseId: string;
    chapterId: string;
}

const ChapterAttachmentForm = ({ initialData, courseId, chapterId }: ChapterAttachmentFormProps) => {
    const [isEditing, setEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const toggleEditing = () => setEditing((prev) => !prev);

    const handleSubmit = useCallback(async (values: { url: string; name: string; key: string }) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/attachments`, values);
            await queryClient.invalidateQueries({ queryKey: ["chapter", courseId, chapterId] })
            toggleEditing();
            toast.success("Вкладення створено успішно.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    }, [courseId, chapterId, queryClient]);

    const handleDelete = useCallback(async (attachment: Attachment) => {
        try {
            setDeletingId(attachment.id);

            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/attachments/${attachment.id}/${attachment.key}`);
            await queryClient.invalidateQueries({ queryKey: ["chapter", courseId, chapterId] })

            toast.success("Вкладення видалено успішно.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    }, [courseId, chapterId, queryClient]);

    return (
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Матеріали розділу
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Прикріпити файл"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Прикріпити файл
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <div className={cn("text-md text-gray-700 mt-2", !initialData.attachments.length && "italic")}>
                    {!initialData.attachments.length ? "Ще не додано жодних файлів" : (
                        <div>
                            <div className="space-y-2 mt-4">
                                {initialData.attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-900 rounded-md"
                                    >
                                        <File className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <p className="text-sm line-clamp-1">{attachment.name}</p>
                                        {deletingId === attachment.id ? (
                                            <div className="flex-shrink-0 ml-4">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleDelete(attachment)}
                                                className="ml-auto hover:opacity-75 transition"
                                                aria-label="Видалити вкладення"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-muted-foreground mt-4">
                                Ці ресурси відображатимуться тільки в цьому розділі.
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChangeAction={(url?: string, name?: string, key?: string) => {
                            if (url && name && key) {
                                handleSubmit({ url, name, key });
                            }
                        }}
                    />
                    <div className="text-sm text-muted-foreground mt-4">
                        Додайте матеріали, які можуть знадобитися вашим студентам для вивчення поточної теми.
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterAttachmentForm;