import {
    AssignmentInfoBlock
} from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/assignments/[assignmentId]/_components/assignment-info-block";
import {CalendarCheck, GithubIcon, StarIcon} from "lucide-react";
import {Preview} from "@/components/editor/preview";
import {format} from "date-fns";
import {useSession} from "next-auth/react";

interface AssignmentInformationProps {
    assignmentRepositoryUrl: string;
    lastAttemptProgressStatus?: string;
    deadline: Date;
    assignmentMaxScore: number;
    assignmentDescription: string;
}

const AssignmentInformation = ({
    assignmentRepositoryUrl,
    lastAttemptProgressStatus,
    deadline,
    assignmentMaxScore,
    assignmentDescription
}: AssignmentInformationProps) => {
    const formattedDeadline = format(new Date(deadline), "dd.MM.yyyy");
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }

    return (
        <div className="border bg-white border-gray-900/25 rounded-md m-4 p-4">
            <h2 className="text-lg font-semibold mb-2 p-2">
                Опис завдання
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AssignmentInfoBlock
                    icon={GithubIcon}
                    title="https://github.com"
                    subtitle={session?.user.login ?? "UserName"}
                    url={assignmentRepositoryUrl}
                    variant="success"
                />
                <AssignmentInfoBlock
                    icon={CalendarCheck}
                    title={lastAttemptProgressStatus !== 'finished' ? "Виконати до" : "Дата виконання"}
                    subtitle={formattedDeadline}
                    variant="success"
                />
                <AssignmentInfoBlock
                    icon={StarIcon}
                    title={lastAttemptProgressStatus !== 'finished' ? "Максимальний бал" : "Підсумковий бал"}
                    subtitle={assignmentMaxScore.toString()}
                    variant="success"
                />
            </div>
            <div className="p-2">
                <Preview value={assignmentDescription}/>
            </div>
        </div>
    )
}

export default AssignmentInformation;