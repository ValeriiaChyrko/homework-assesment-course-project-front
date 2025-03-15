import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AssignmentAttemptResultsTable } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/attempts-data-table";
import { courseColumns } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/course-columns";
import {Eye, Menu} from "lucide-react";

interface AttemptResultsDialogProps {
    courseTitle: string;
    chapterTitle: string;
    assignment: Assignment & {
        attemptProgress: AttemptProgress[];
    };
}

export function AttemptResultsDialog({
                                         courseTitle,
                                         chapterTitle,
                                         assignment,
                                     }: AttemptResultsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger className="h-4 w-auto p-0 flex items-center">
                <span className="hidden lg:flex items-center">
                    <Menu className="mr-2 h-4 w-4" />
                    Переглянути дані
                </span>
                <Eye className="block h-4 w-4 lg:hidden" />
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl p-6 max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{courseTitle}</DialogTitle>
                    <DialogDescription>
                        Розділ: {chapterTitle} - Завдання: {assignment.title}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <div className="container mx-auto overflow-x-auto">
                        <AssignmentAttemptResultsTable
                            columns={courseColumns}
                            data={assignment.attemptProgress}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}