import {redirect} from "next/navigation";
import AssignmentHeader
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-header";
import AssignmentInformation
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-information";
import AssignmentReviewResults
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-review-results";
import AssignmentSolution
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/assignment-solution";
import {useEffect, useState} from "react";
import axios from "axios";

interface AssignmentIdPageProps {
    courseId: string;
    chapterId: string;
    assignment: Assignment
}

const AssignmentIdPage = ({
    courseId,
    chapterId,
    assignment
}: AssignmentIdPageProps) => {
    const [lastAttempt, setLastAttempt] = useState<AttemptProgress | null>(null);
    const [currentAttempt, setCurrentAttempt] = useState<AttemptProgress | null>(null);
    const [attemptProgress, setAttemptProgress] = useState<AttemptProgress[] | []>([]);

    useEffect(() => {
        const getLastAttempt = async () => {
            if (!chapterId) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignment.id}/attempts/last`);
                const attempt = response.data;
                setLastAttempt(attempt);

                if (attempt.progressStatus === "started") {
                    setCurrentAttempt(attempt);
                }
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        const getAttemptProgress = async () => {
            if (!chapterId) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignment/${assignment.id}/attempts`);
                setAttemptProgress(response.data);
            } catch (error) {
                console.error("Error fetching chapter:", error);
            }
        };

        getLastAttempt().then();
        getAttemptProgress().then();
    }, [assignment, chapterId, courseId]);

    if (!assignment) {
        return redirect(`/courses/${courseId}/chapters/${chapterId}`);
    }

    const isLocked: boolean = (() => {
        if (!assignment) {
            return true;
        }

        const currentDate = new Date();
        const deadlineDate = new Date(assignment.deadline);

        const hasDeadlinePassed = currentDate > deadlineDate;
        const hasMaxAttemptsReached = lastAttempt !== null && lastAttempt.position >= assignment.maxAttemptsAmount;

        return hasDeadlinePassed || hasMaxAttemptsReached;
    })();

    const mapProgressStatusForHeader = (status: string | undefined): "default" | "submitted" | "finished" => {
        if (status === "started") return "submitted";
        if (status === "submitted" || status === "finished") return status;
        return "default";
    };

    const mapProgressStatusForInfo = (status: string | undefined): "default" | "started" | "submitted" | "finished" => {
        if (status === "started" || status === "submitted" || status === "finished") return status;
        return "default";
    };

    return (
        <div className="space-y-2 mb-4">
            <AssignmentHeader
                courseId={courseId}
                chapterId={chapterId}
                assignmentId={assignment.id}
                assignmentTitle={assignment.title}
                attempt={currentAttempt}
                attemptProgress={mapProgressStatusForHeader(lastAttempt?.progressStatus)}
                isLocked={isLocked}
            />
            <AssignmentInformation
                assignmentRepositoryUrl={assignment.repositoryUrl!}
                lastAttemptProgressStatus={lastAttempt?.progressStatus}
                deadline={assignment.deadline}
                assignmentMaxScore={assignment.maxScore}
                assignmentDescription={assignment.description!}
            />
            {lastAttempt && (
                <AssignmentSolution
                    courseId={courseId}
                    chapterId={chapterId}
                    assignment={assignment}
                    attempt={currentAttempt}
                    attemptProgress={mapProgressStatusForInfo(lastAttempt?.progressStatus)}
                    isLocked={isLocked}
                />
            )}
            {(lastAttempt?.progressStatus === "submitted" || lastAttempt?.progressStatus === "finished") && (
                <AssignmentReviewResults
                    assignment={assignment}
                    attemptList={attemptProgress}
                />
            )}
        </div>
    );
}

export default AssignmentIdPage;