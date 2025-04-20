import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number;
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("DASHBOARD_COURSES: No access token");
            return NextResponse.json(
                { completedCourses: [], coursesInProgress: [] },
                { status: 401 }
            );
        }

        const queryParams = new URLSearchParams([
            ["Include", "category"],
            ["Include", "chapters"],
            ["Include", "student-progress"],
            ["FilterBy", "student"],
            ["IsPublished", "true"]
        ]);

        const { data, status, error } = await fetchWithAuth<{
            items: CourseWithProgressWithCategory[];
            totalCount: number;
            page: number;
            pageSize: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        }>({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams}`,
        });

        if (!data) {
            console.error("DASHBOARD_COURSES: Fetch failed", status, error);
            return NextResponse.json(
                { completedCourses: [], coursesInProgress: [] },
                { status }
            );
        }

        const courses = data.items.map((item: CourseWithProgressWithCategory) => ({
            ...item,
            category: item.category ?? { name: "Без категорії" },
            chapters: item.chapters ?? [],
            progress: item.progress ?? 0
        }));

        const completedCourses = courses
            .filter(c => c.progress === 100)
            .sort((a, b) => b.progress! - a.progress!);

        const coursesInProgress = courses
            .filter(c => c.progress! < 100)
            .sort((a, b) => b.progress! - a.progress!);

        return NextResponse.json({
            completedCourses,
            coursesInProgress,
            totalCount: data.totalCount,
            page: data.page,
            pageSize: data.pageSize,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage
        });
    } catch (error) {
        console.error("DASHBOARD_COURSES: Unexpected error", error);
        return NextResponse.json(
            { completedCourses: [], coursesInProgress: [] },
            { status: 500 }
        );
    }
}