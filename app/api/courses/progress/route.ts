import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import {NextResponse} from "next/server";

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

        const courses: CourseWithProgressWithCategory[] = await apiResponse.json();

        const completedCourses = courses.filter((course) => course.progress === 100);
        const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

        return NextResponse.json({
            completedCourses,
            coursesInProgress,
        });
    } catch (e) {
        console.error("GET_DASHBOARD_COURSES", e);
        return NextResponse.json({
            completedCourses: [],
            coursesInProgress: []
        });
    }
}