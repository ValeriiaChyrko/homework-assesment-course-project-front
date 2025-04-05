import { AssignmentInfoBlock } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-info-block";
import {FolderGit2, GitBranch, RefreshCcw} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { GitHubBranchForm } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-github-branch-form";
import toast from "react-hot-toast";
import { ProgressButton } from "@/components/progress-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {Button} from "@/components/ui/button";

interface AssignmentInformationProps {
    courseId: string;
    chapterId: string;
    assignment: Assignment;
    attempt: Attempt;
    isLocked: boolean;
}

const fetchAllUserBranches = async (courseId: string, chapterId: string, attemptId: string, assignment: Assignment): Promise<string[] | []> => {
    console.log("fetchAllUserBranches", courseId, chapterId, attemptId);
    const response = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}/attempts/${attemptId}/branches`,
        { assignment }
    );
    return response.data;
};

const AssignmentInformation = ({
                                   courseId,
                                   chapterId,
                                   assignment,
                                   attempt,
                                   isLocked,
                               }: AssignmentInformationProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const { data: branches, isFetching, refetch } = useQuery({
        queryKey: ["branches", courseId, chapterId, assignment.id, attempt.id],
        queryFn: () => fetchAllUserBranches(courseId, chapterId, attempt.id, assignment),
        enabled: !!courseId && !!chapterId && !!assignment.id && !!attempt.id && !isLocked,
        refetchInterval: () => (isLocked ? 180000 : false),
    });

    const handleSubmitAttempt = async () => {
        if (!attempt) {
            console.error("Error submitting attempt: ID is not defined.");
            return;
        }

        setIsLoading(true);
        try {
            await axios.put(
                `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}/attempts/${attempt.id}/submit`,
                { attempt, assignment }
            );
            await queryClient.invalidateQueries({
                queryKey: ["attempts", courseId, chapterId, assignment.id],
            });

            toast.success("Спробу подано успішно.");
        } catch (error) {
            console.error("Error submitting attempt:", error);
            toast.error("На жаль, щось пішло не так. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border bg-white border-gray-900/25 rounded-md m-4 p-4">
            <h2 className="text-lg font-semibold mb-2 p-2">Рішення</h2>

            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4 mb-2">
                <div className="col-span-1">
                    <AssignmentInfoBlock
                        icon={FolderGit2}
                        title="Мій репозиторій"
                        variant="default"
                        url={assignment.repositoryUrl}
                        action={
                            <div className="py-2 text-slate-900 font-semibold">
                                {assignment.repositoryName!}
                            </div>
                        }
                    />
                </div>
                <div className="col-span-2">
                    <AssignmentInfoBlock
                        icon={GitBranch}
                        title="Гілка"
                        variant="default"
                        action={
                            <div className="w-full flex flex-row items-center gap-1">
                                <GitHubBranchForm
                                    initialData={{ branchName: attempt?.branchName }}
                                    courseId={courseId}
                                    chapterId={chapterId}
                                    assignmentId={assignment.id}
                                    attemptId={attempt.id}
                                    options={branches ? branches.map((branch) => ({
                                        label: branch,
                                        value: branch,
                                    })) : []}
                                />
                                {!isFetching && !isLoading && (
                                        <Button
                                            onClick={() => refetch()}
                                            variant="ghost"
                                            disabled={isFetching || isLoading}
                                            className="px-1 justify-self-start"
                                        >
                                            <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                )}
                            </div>
                        }
                    />
                </div>
            </div>

            <div>
                <ProgressButton
                    type="button"
                    onClick={handleSubmitAttempt}
                    disabled={isLoading || isLocked}
                    variant="started"
                    className="w-full md:w-auto my-4"
                />
                {isLoading && <p className="text-sm text-gray-500 mt-1">Зачекайте, триває перевірка вашої роботи. Це може зайняти кілька хвилин...</p>}
            </div>
        </div>
    );
};

export default AssignmentInformation;