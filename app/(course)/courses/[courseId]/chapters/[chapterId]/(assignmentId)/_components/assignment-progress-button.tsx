"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { ProgressButton } from "@/components/progress-button";

interface AssignmentProgressButtonProps {
    courseId: string;
    chapterId: string;
    assignmentId: string;
    attempt: AttemptProgress | null;
    progressStatus: "default" | "started" | "submitted" | "finished";
    isLocked: boolean;
}

export const AssignmentProgressButton = ({
                                             courseId,
                                             chapterId,
                                             assignmentId,
                                             attempt,
                                             progressStatus,
                                             isLocked,
                                         }: AssignmentProgressButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCreateAttempt = async () => {
        setIsLoading(true);
        try {
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignmentId}/attempts`, attempt);
            toast.success("Спробу розпочато успішно.");
            router.refresh();
        } catch (error) {
            console.error("Error creating attempt:", error);
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitAttempt = async () => {
        setIsLoading(true);
        if (!attempt) {
            console.error("Error submitting attempt: ID is not defined.");
            return;
        }
        try {
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignmentId}/attempts/${attempt?.id}`, attempt);
            toast.success("Спробу подано успішно.");
            router.refresh();
        } catch (error) {
            console.error("Error submitting attempt:", error);
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishedAssignment = async () => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignmentId}/attempts/${attempt?.id}/finish`);
            toast.success("Спробу завершено успішно.");
            router.refresh();
        } catch (error) {
            console.error("Error finishing attempt:", error);
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreAssignment = async () => {
        setIsLoading(true);
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignmentId}/attempts/${attempt?.id}/restore`);
            toast.success("Спробу відновлено успішно.");
            router.refresh();
        } catch (error) {
            console.error("Error restoring attempt:", error);
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const onClick = async () => {
        if (isLocked) {
            toast.error("Завдання заблоковане.");
            return;
        }

        if (!attempt) {
            await handleCreateAttempt();
        } else {
            switch (progressStatus) {
                case 'started':
                    await handleSubmitAttempt();
                    break;
                case 'submitted':
                    await handleFinishedAssignment();
                    break;
                case 'finished':
                    await handleRestoreAssignment();
                    break;
                default:
                    await handleCreateAttempt();
                    break;
            }
        }
    };

    return (
        <ProgressButton
            type="button"
            onClick={onClick}
            disabled={isLoading || isLocked}
            variant={progressStatus}
            className="w-full md:w-auto"
        />
    );
};