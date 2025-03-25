"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/models/confirm-modal";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import {useQueryClient} from "@tanstack/react-query";

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({
                            disabled,
                            courseId,
                            isPublished,
                        }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();
    const confetti = useConfettiStore();

    const handlePublishToggle = useCallback(async () => {
        setIsLoading(true);
        try {
            const action = isPublished ? 'unpublish' : 'publish';
            await axios.patch(`/api/courses/${courseId}/${action}`);
            toast.success(`Курс ${isPublished ? 'знято з публікації' : 'опубліковано'}.`);
            if (!isPublished) confetti.onOpen();

            await queryClient.invalidateQueries({ queryKey: ["owned_courses"] });
            await queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        } catch (error) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isPublished, courseId, confetti, queryClient]);

    const handleDelete = useCallback(async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/courses/${courseId}`);
            toast.success("Дані видалено успішно.");

            await queryClient.invalidateQueries({ queryKey: ["owned_courses"] });
            await queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            router.push(`/teacher/courses`);
        } catch (error) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [courseId, queryClient, router]);

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={handlePublishToggle}
                disabled={disabled || isLoading}
                variant="outline"
                className="flex items-center transition-colors text-md"
                aria-label={isPublished ? "Зняти з публікації курс" : "Опублікувати курс"}
            >
                {isPublished ? "Зняти з публікації" : "Опублікувати"}
            </Button>
            <ConfirmDialog onConfirm={handleDelete}>
                <Button
                    disabled={isLoading}
                    className="flex items-center transition-colors"
                    aria-label="Видалити курс"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </ConfirmDialog>
        </div>
    );
};