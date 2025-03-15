import AttemptBlock
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/(assignmentId)/_components/attempt-block";

interface AssignmentReviewResultsProps {
    assignment: Assignment;
    attemptList: AttemptProgress[]
}

const AssignmentReviewResults = ({
    assignment,
    attemptList,
}: AssignmentReviewResultsProps) => {
    const totalAmount = assignment.maxAttemptsAmount;
    const completedAttempt = attemptList.length;

    const attemptAmountText = `${completedAttempt}/${totalAmount}`;

    return (
        <div className="border bg-white rounded-md m-4 p-4">
            <div className="flex flex-row items-center justify-between">
                <h2 className="text-md font-semibold mb-2 mt-2 p-2">
                    Результати перевірки
                </h2>
                <span className="text-sm text-slate-700 p-2">
                    Кількість спроб: {attemptAmountText}
                </span>
            </div>
            <div className="bg-white">
                {attemptList && attemptList.length > 0 ? (
                    attemptList.map(attempt => (
                        <div className="border rounded-md m-4 p-4" key={attempt.id}>
                            <AttemptBlock attempt={attempt} assignment={assignment}/>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-900 font-semibold">Для даного завдання ви не ще не робили спроби перевірки.</p>
                )}
            </div>
        </div>
    )
}

export default AssignmentReviewResults;