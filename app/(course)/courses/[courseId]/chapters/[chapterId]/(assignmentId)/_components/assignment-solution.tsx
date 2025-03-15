import {
    AssignmentInfoBlock
} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-info-block";
import {FolderGit2, GitBranch} from "lucide-react";
import GitHubBranchForm
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-github-branch-form";
import {
    AssignmentProgressButton
} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-progress-button";
import {useEffect, useState} from "react";
import axios from "axios";

interface AssignmentInformationProps {
    courseId: string;
    chapterId: string;
    assignment: Assignment;
    attempt: AttemptProgress | null;
    attemptProgress: "default" | "started" | "submitted" | "finished";
    isLocked: boolean;
}

const AssignmentInformation = ({
    courseId,
    chapterId,
    assignment,
    attempt,
    attemptProgress,
    isLocked,
}: AssignmentInformationProps) => {
    const [branches, setBranches] = useState<string[] | []>([]);
    useEffect(() => {
        const getUserRepoBranches = async () => {
            if (!assignment) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignment.id}/branches`);
                setBranches(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        getUserRepoBranches().then();
    }, [assignment, chapterId, courseId]);

    return (
        <div className="border bg-white rounded-md m-4 p-4">
            <h2 className="text-md font-semibold mb-2 p-2">
                Рішення
            </h2>
            <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-4 mb-8">
                <div className="col-span-1">
                    <AssignmentInfoBlock
                        icon={FolderGit2}
                        title="Мій репозиторій"
                        subtitle={assignment.repositoryName!}
                        variant="default"
                        url={assignment.repositoryUrl}
                        action={<div className="pb-9"/>}
                    />
                </div>
                <div className="col-span-2">
                    <AssignmentInfoBlock
                        icon={GitBranch}
                        title="Гілка"
                        variant="default"
                        subtitle="test-branch"
                        action={
                            <GitHubBranchForm
                                initialData={attempt}
                                courseId={courseId}
                                chapterId={chapterId}
                                assignmentId={assignment.id}
                                attemptId={attempt?.id ?? ''}
                                options={branches.map((branch) => ({
                                    label: branch,
                                    value: branch
                                }))}
                            />
                        }
                    />
                </div>
            </div>
            <AssignmentProgressButton
                courseId={courseId}
                chapterId={chapterId}
                assignmentId={assignment.id}
                attempt={attempt}
                progressStatus={attemptProgress}
                isLocked={isLocked}
            />
        </div>
    )
}

export default AssignmentInformation;