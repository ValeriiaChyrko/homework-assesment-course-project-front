import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number | null;
};

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        if (!token || !userId) {
            console.error("GET_COURSES: No token or userId found");
            return {
                completedCourses: [],
                coursesInProgress: []
            };
        }

        const url = new URL(req.url);
        const title = url.searchParams.get('title');
        const categoryId = url.searchParams.get('categoryId');

        const queryParams = new URLSearchParams({ userId });
        if (title) queryParams.append("Title", title);
        if (categoryId) queryParams.append("CategoryId", categoryId);
        queryParams.append("Include", "category");
        queryParams.append("Include", "progress");
        queryParams.append("IsPublished", "true");

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_COURSES: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                courses: [],
            });
        }

        const responseData = await apiResponse.json();

        const courses: CourseWithProgressWithCategory[] = responseData.items.map((item: CourseWithProgressWithCategory) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            isPublished: item.isPublished,
            category: item.category || "Без категорії",
            chapters: item.chapters || [],
            progress: item.progress || 0,
            userId: item.userId,
        }));

        return NextResponse.json({
            courses,
            totalCount: responseData.totalCount,
            page: responseData.page,
            pageSize: responseData.pageSize,
            hasPreviousPage: responseData.hasPreviousPage,
            hasNextPage: responseData.hasNextPage,
        });
    } catch (e) {
        console.error("GET_DASHBOARD_COURSES", e);
        return NextResponse.json({
            courses: []
        });
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