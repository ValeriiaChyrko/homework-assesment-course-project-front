"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/models/confirm-modal";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import {useQueryClient} from "@tanstack/react-query";

interface AssignmentActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    assignmentId: string;
    isPublished: boolean;
}

export const AssignmentActions = ({
                                      disabled,
                                      courseId,
                                      chapterId,
                                      assignmentId,
                                      isPublished,
                                  }: AssignmentActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const onClick = useCallback(async () => {
        if (disabled || isLoading) return;

        try {
            setIsLoading(true);

            const action = isPublished ? "unpublish" : "publish";
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/${action}`
            );

            toast.success(
                `Завдання ${isPublished ? "знято з публікації" : "опубліковано"}.`
            );
            await queryClient.invalidateQueries({ queryKey: ["assignment", courseId, chapterId, assignmentId] });
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Сталася помилка, спробуйте ще раз."
            );
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [disabled, isLoading, isPublished, courseId, chapterId, assignmentId, queryClient]);

    const onDelete = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            await axios.delete(
                `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`
            );

            toast.success("Завдання успішно видалено.");
            router.refresh();
            router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Сталася помилка, спробуйте ще раз."
            );
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, courseId, chapterId, assignmentId, router]);

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant="outline" size="sm">
                {isPublished ? "Зняти з публікації" : "Опублікувати"}
            </Button>
            <ConfirmDialog onConfirm={onDelete}>
                <Button disabled={isLoading} size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </ConfirmDialog>
        </div>
    );
};