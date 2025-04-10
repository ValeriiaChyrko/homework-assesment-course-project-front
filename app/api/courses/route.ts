import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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
                {
                    courses: [],
                    totalCount: 0,
                    page: 1,
                    pageSize: 10,
                    hasPreviousPage: false,
                    hasNextPage: false,
                },
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams.toString()}`,
        });

        if (!data) {
            console.error("GET_COURSES: Fetch failed", status, error);
            return NextResponse.json(
                {
                    courses: [],
                    totalCount: 0,
                    page: 1,
                    pageSize: 10,
                    hasPreviousPage: false,
                    hasNextPage: false,
                },
                { status }
            );
        }

        const courses: CourseWithProgressWithCategory[] = data.items.map(
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
            totalCount: data.totalCount,
            page: data.page,
            pageSize: data.pageSize,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage,
        });
    } catch (error) {
        console.error("GET_COURSES: Unexpected error", error);
        return NextResponse.json(
            {
                courses: [],
                totalCount: 0,
                page: 1,
                pageSize: 10,
                hasPreviousPage: false,
                hasNextPage: false,
            },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("CREATE_COURSE: No access token");
            return NextResponse.json({ course: null }, { status: 401 });
        }

        const { title } = await req.json();

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
            payload: { title },
        });

        return NextResponse.json({ course: data }, { status });
    } catch (error) {
        console.error("CREATE_COURSE: Unexpected error", error);
        return NextResponse.json({ course: null }, { status: 500 });
    }
}