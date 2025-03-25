import AttemptBlock
    from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/attempt-block";

interface AssignmentReviewResultsProps {
    assignment: Assignment;
    attemptList: Attempt[]
}

const AssignmentReviewResults = ({
    assignment,
    attemptList,
}: AssignmentReviewResultsProps) => {
    const totalAmount = assignment.maxAttemptsAmount;
    const completedAttempt = attemptList.length;

    const attemptAmountText = `${completedAttempt}/${totalAmount}`;

    return (
        <div className="border bg-white border-gray-900/25 rounded-md m-4 p-4">
            <div className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold mb-2 p-2">
                    Результати перевірки
                </h2>
                <span className="text-md text-slate-700 mb-2 p-2">
                    Кількість спроб: {attemptAmountText}
                </span>
            </div>
            <div className="bg-white">
                {attemptList && attemptList.length > 0 ? (
                    attemptList.map(attempt => (
                        <div className="border border-gray-900/25 rounded-md m-4 p-4" key={attempt.id}>
                            <AttemptBlock attempt={attempt} assignment={assignment}/>
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-md text-slate-500 italic">Для даного завдання ви не ще не робили спроби перевірки.</p>
                )}
            </div>
        </div>
    )
}

export default AssignmentReviewResults;