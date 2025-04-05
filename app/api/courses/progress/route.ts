import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

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
            ["Include", "progress"],
            ["FilterBy", "student"],
            ["IsPublished", "true"]
        ]);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("DASHBOARD_COURSES: Fetch failed", response.status, errorText);

            return NextResponse.json(
                { completedCourses: [], coursesInProgress: [] },
                { status: response.status }
            );
        }

        const {
            items,
            totalCount,
            page,
            pageSize,
            hasNextPage,
            hasPreviousPage
        } = await response.json();

        const courses: CourseWithProgressWithCategory[] = items.map((item:CourseWithProgressWithCategory) => ({
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
            totalCount,
            page,
            pageSize,
            hasPreviousPage,
            hasNextPage
        });
    } catch (error) {
        console.error("DASHBOARD_COURSES: Unexpected error", error);
        return NextResponse.json(
            { completedCourses: [], coursesInProgress: [] },
            { status: 500 }
        );
    }
}