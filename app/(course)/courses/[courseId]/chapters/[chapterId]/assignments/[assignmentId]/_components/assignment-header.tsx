import { ProgressButton } from "@/components/progress-button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface AssignmentHeaderProps {
    courseId: string;
    chapterId: string;
    assignment: Assignment;
    attempt?: Attempt | null;
    progress?: UserAssignmentProgress | null;
}

const determineVariant = (
    attempt: Attempt | null,
    progress: UserAssignmentProgress | null
): "default" | "started" | "submitted" | "finished" => {
    if (!attempt) return "default";
    if (progress?.isCompleted) return "finished";
    return "submitted";
};

const AssignmentHeader = ({
                              courseId,
                              chapterId,
                              assignment,
                              attempt = null,
                              progress = null,
                          }: AssignmentHeaderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleAttemptAction = async (action: "create" | "finish" | "restore") => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const url =
                action === "create"
                    ? `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}/attempts`
                    : `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}/attempts/${attempt?.id}/${action}`;

            if (action === "create") {
                await axios.post(url);
            } else {
                await axios.patch(url);
            }

            await queryClient.invalidateQueries({
                queryKey: ["attemptProgress", courseId, chapterId, assignment.id],
            });

            await queryClient.invalidateQueries({
                queryKey: ["assignment", courseId, chapterId, assignment.id],
            });

            await queryClient.invalidateQueries({
                queryKey: ["attempts", courseId, chapterId, assignment.id],
            });

            toast.success(
                action === "create"
                    ? "Спробу розпочато успішно."
                    : action === "finish"
                        ? "Завдання завершено успішно."
                        : "Завдання відновлено успішно."
            );
        } catch (error) {
            console.error(`Error ${action} attempt:`, error);
            toast.error("На жаль, щось пішло не так. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    const onClick = async () => {
        if (new Date() > new Date(assignment.deadline)) {
            toast.error("Завдання заблоковане.");
            return;
        }

        if (!attempt) {
            await handleAttemptAction("create");
            return;
        }

        const variant = determineVariant(attempt, progress);
        if (variant === "submitted") {
            await handleAttemptAction("finish");
        } else if (variant === "finished") {
            await handleAttemptAction("restore");
        }
    };

    return (
        <div className="border border-gray-900/25 bg-white rounded-md flex flex-col space-y-4 md:!flex-row items-center justify-between m-4 px-6">
            <h2 className="text-lg font-semibold mt-4">{assignment.title}</h2>
            <ProgressButton
                type="button"
                onClick={onClick}
                disabled={isLoading}
                variant={determineVariant(attempt, progress)}
                className="w-full md:w-auto my-4"
            />
        </div>
    );
};

export default AssignmentHeader;