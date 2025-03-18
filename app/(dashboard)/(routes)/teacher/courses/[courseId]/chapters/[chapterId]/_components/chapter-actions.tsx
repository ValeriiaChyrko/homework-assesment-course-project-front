"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/models/confirm-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({
                                   disabled,
                                   courseId,
                                   chapterId,
                                   isPublished,
                               }: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleError = (error: unknown) => {
        toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
        console.error(error);
    };

    const togglePublishStatus = async () => {
        const action = isPublished ? "unpublish" : "publish";
        const message = isPublished ? "Розділ знято з публікації." : "Розділ опубліковано.";

        try {
            setIsLoading(true);
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/${action}`);
            toast.success(message);
            router.refresh();
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteChapter = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Дані видалено успішно.");
            router.push(`/teacher/courses/${courseId}`);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={togglePublishStatus}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
                aria-label={isPublished ? "Зняти з публікації" : "Опублікувати"}
            >
                {isPublished ? "Зняти з публікації" : "Опублікувати"}
            </Button>
            <ConfirmDialog onConfirm={deleteChapter}>
                <Button disabled={isLoading} size="sm" aria-label="Видалити розділ">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </ConfirmDialog>
        </div>
    );
};