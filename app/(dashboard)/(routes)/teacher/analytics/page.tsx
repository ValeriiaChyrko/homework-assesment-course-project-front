import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getAnalytics} from "@/actions/get-analytics";
import {DataCard} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import { Chart } from "./_components/chart";
import { getCourseAnalytics } from "@/actions/get-course-analytics";
import {AttemptResultsDialog} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/attempt-results-dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {GraduationCap, School} from "lucide-react";
import {CourseTable} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/course-data-table";


const AnalyticsPage = async () => {
    const {userId} = await auth();

    if (!userId) {
        return redirect('/');
    }

    const {
        data,
        totalStudents
    } = await getAnalytics(userId);

    const {
        courses,
        totalAttempts
    } = await getCourseAnalytics(userId);

    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <DataCard
                    value={totalStudents}
                    label="Загальна кількість студентів"
                    icon={GraduationCap}
                />
            </div>
            <Chart
                data={data}
            />
            <DataCard
                value={totalAttempts}
                label="Статистика активності студентів"
                icon={School}
            />
            <CourseTable
                courses={courses}
            />
        </div>
    )
}

export default AnalyticsPage;