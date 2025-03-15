import {
    AssignmentProgressButton
} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-progress-button";

interface AssignmentHeaderProps {
    courseId: string;
    chapterId: string;
    assignmentId: string;
    assignmentTitle: string;
    attempt: AttemptProgress | null;
    attemptProgress: "default" | "submitted" | "finished";
    isLocked: boolean;
}

const AssignmentHeader = ({
                              courseId,
                              chapterId,
                              assignmentId,
                              assignmentTitle,
                              attempt,
                              attemptProgress,
                              isLocked,
                          }: AssignmentHeaderProps) => {

    return (
        <div className="border bg-white rounded-md flex flex-col md:flex-row items-center justify-between m-4 p-4">
            <h2 className="text-md font-semibold mb-2 mt-2">
                {assignmentTitle}
            </h2>
            <AssignmentProgressButton
                courseId={courseId}
                chapterId={chapterId}
                assignmentId={assignmentId}
                attempt={attempt}
                progressStatus={attemptProgress}
                isLocked={isLocked}
            />
        </div>
    );
}

export default AssignmentHeader;