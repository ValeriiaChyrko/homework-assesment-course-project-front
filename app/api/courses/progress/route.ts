import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number | null;
};

export async function GET() {
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

        const queryParams = new URLSearchParams();
        queryParams.append("Include", "category");
        queryParams.append("Include", "progress");
        queryParams.append("IsPublished", "true");

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${userId}/users?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_COURSES: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                completedCourses: [],
                coursesInProgress: []
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

        const completedCourses = courses.filter(course => course.progress === 100);
        const coursesInProgress = courses.filter(course => course.progress! < 100);

        completedCourses.sort((a, b) => b.progress! - a.progress!);

        coursesInProgress.sort((a, b) => b.progress! - a.progress!);

        return NextResponse.json({
            completedCourses,
            coursesInProgress,
            totalCount: responseData.totalCount,
            page: responseData.page,
            pageSize: responseData.pageSize,
            hasPreviousPage: responseData.hasPreviousPage,
            hasNextPage: responseData.hasNextPage,
        });
    } catch (e) {
        console.error("GET_DASHBOARD_COURSES", e);
        return NextResponse.json({
            completedCourses: [],
            coursesInProgress: []
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