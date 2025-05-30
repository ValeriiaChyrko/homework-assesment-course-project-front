﻿"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    isCompleted?: boolean;
    nextChapter?: Chapter | null;
}

export const CourseProgressButton = ({
                                         chapterId,
                                         courseId,
                                         isCompleted,
                                         nextChapter,
                                     }: CourseProgressButtonProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted,
            });

            await queryClient.invalidateQueries({ queryKey: ["userProgress", courseId, chapterId] });
            await queryClient.invalidateQueries({ queryKey: ["courseWithProgress", courseId] });

            if (!isCompleted && !nextChapter) {
                confetti.onOpen();
            }

            if (!isCompleted && nextChapter?.id) {
                router.push(`/courses/${courseId}/chapters/${nextChapter.id}`);
            }

            toast.success("Прогрес оновлено успішно.");
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const Icon = isCompleted ? XCircle : CheckCircle;

    return (
        <Button
            type="button"
            onClick={onClick}
            disabled={isLoading}
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Не завершено" : "Позначити як завершений"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    );
};