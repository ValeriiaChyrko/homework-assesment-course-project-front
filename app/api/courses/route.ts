import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number;
};

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("GET_COURSES: No access token");
            return NextResponse.json(
                { courses: [], totalCount: 0, page: 1, pageSize: 10, hasPreviousPage: false, hasNextPage: false },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const title = url.searchParams.get("title");
        const categoryId = url.searchParams.get("categoryId");
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 10);

        const queryParams = new URLSearchParams([
            ["Include", "category"],
            ["Include", "chapters"],
            ["Include", "progress"],
            ["IsPublished", "true"],
            ["Title", title || ""],
            ["CategoryId", categoryId || ""],
            ["Page", page.toString()],
            ["PageSize", pageSize.toString()],
        ]);

        const apiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("GET_COURSES: Fetch failed", apiResponse.status, errorText);
            return NextResponse.json(
                { courses: [], totalCount: 0, page: 1, pageSize: 10, hasPreviousPage: false, hasNextPage: false },
                { status: apiResponse.status }
            );
        }

        const {
            items,
            totalCount,
            page: currentPage,
            pageSize: currentPageSize,
            hasNextPage,
            hasPreviousPage,
        } = await apiResponse.json();

        const courses: CourseWithProgressWithCategory[] = items.map(
            (item: CourseWithProgressWithCategory) => ({
                ...item,
                category: item.category ?? { name: "Без категорії" },
                chapters: item.chapters ?? [],
                progress: item.progress ?? 0,
            })
        );

        const completedCourses = courses
            .filter((c) => c.progress === 100)
            .sort((a, b) => b.progress! - a.progress!);

        const coursesInProgress = courses
            .filter((c) => c.progress! < 100)
            .sort((a, b) => b.progress! - a.progress!);

        return NextResponse.json({
            courses,
            completedCourses,
            coursesInProgress,
            totalCount,
            page: currentPage,
            pageSize: currentPageSize,
            hasPreviousPage,
            hasNextPage,
        });
    } catch (error) {
        console.error("GET_COURSES: Unexpected error", error);
        return NextResponse.json(
            { courses: [], totalCount: 0, page: 1, pageSize: 10, hasPreviousPage: false, hasNextPage: false },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { title } = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                course: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                userId
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const course = await apiResponse.json();
        return NextResponse.json(course);
    } catch (e) {
        console.error("[COURSES]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}