import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {SquareCheckBig, SquareX} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface AttemptBlockProps {
    assignment: Assignment;
    attempt: AttemptProgress;
}

const getBadgeVariant = (percentage: number) => {
    if (percentage >= 91) return "grade-a";
    if (percentage >= 83) return "grade-b";
    if (percentage >= 76) return "grade-c";
    if (percentage >= 68) return "grade-d";
    if (percentage >= 61) return "grade-e";
    return "grade-f";
};

const AttemptBlock = ({
    assignment,
    attempt,
}: AttemptBlockProps) => {
    const sections = [
        {
            title: "Компіляція",
            score: attempt.compilationScore,
            minScore: assignment.attemptCompilationMinScore || 0,
            maxScore: assignment.attemptCompilationMaxScore || 0,
        },
        {
            title: "Тести",
            score: attempt.testsScore,
            minScore: assignment.attemptTestsMinScore|| 0,
            maxScore: assignment.attemptTestsMaxScore || 0,
        },
        {
            title: "Якість",
            score: attempt.qualityScore,
            minScore: assignment.attemptQualityMinScore || 0,
            maxScore: assignment.attemptQualityMaxScore || 0,
        },
    ];

    const completionText = `Завершено: ${attempt.finalScore}/${assignment.maxScore}`;
    const percentage = assignment.maxScore ? (attempt.finalScore / assignment.maxScore) * 100 : 0;

    return (
        <div className="flex flex-col items-start justify-between">
            <div className="flex items-center gap-2">
                <h2 className="text-md text-slate-700">
                    Спроба № {attempt.position}
                </h2>
                <Badge
                    variant={getBadgeVariant(percentage)}
                    className={cn(
                        "pb-1 mt-1",
                    )}>
                    {completionText}
                </Badge>
            </div>
            <div className="w-full mt-3 mr-5">
                {sections.map(({ title, score, minScore, maxScore }) => {
                    const isPassed = score > minScore;
                    const badgeText = isPassed ? "Пройдено" : "Провалено";

                    return (
                        <div
                            key={title}
                            className="flex items-start gap-3 mb-3 p-3 bg-gray-50/50 rounded-md"
                        >
                            <IconBadge icon={isPassed ? SquareCheckBig : SquareX} variant={isPassed ? "success" : "warning"} />

                            <div className="flex flex-col w-full">
                                <div className="flex items-center">
                                    <h3 className="text-md text-slate-800">{title}</h3>
                                    <Badge variant={isPassed ? "grade-a" : "grade-f"} className="ml-2 pb-1 text-xs">
                                        {badgeText}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap sm:flex-row sm:space-x-4 flex-col space-y-1 sm:space-y-0 mt-1 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-slate-500">Бал:</span>
                                        <span className="text-slate-800 font-semibold">{score}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-slate-500">Максимальний бал:</span>
                                        <span className="text-slate-800 font-semibold">{maxScore}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-slate-500">Мінімальний бал:</span>
                                        <span className="text-slate-800 font-semibold">{minScore}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default AttemptBlock;