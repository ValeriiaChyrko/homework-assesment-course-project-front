import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type CourseWithCategory = Course & {
    category: Category | null;
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        if (!token || !userId) {
            console.error("GET_COURSES: No token or userId found");
            return NextResponse.json({
                courses: []
            });
        }

        const queryParams = new URLSearchParams();
        queryParams.append("OwnerId", userId);
        queryParams.append("PageNumber", "1");
        queryParams.append("PageSize", "100");
        queryParams.append("IsAscending", "true");
        queryParams.append("Include", "category");

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
                courses: []
            });
        }

        const responseData = await apiResponse.json();

        const courses: CourseWithCategory[] = responseData.items.map((item: CourseWithCategory) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            isPublished: item.isPublished,
            category: item.category || null,
            userId: item.userId,
        }));

       const response = NextResponse.json({
            courses,
            totalCount: responseData.totalCount,
            page: responseData.page,
            pageSize: responseData.pageSize,
            hasPreviousPage: responseData.hasPreviousPage,
            hasNextPage: responseData.hasNextPage,
        });

        response.headers.set("Cache-Control", "max-age=900, must-revalidate");
        return response;
    } catch (e) {
        console.error("GET_DASHBOARD_COURSES", e);
        return NextResponse.json({
            courses: []
        });
    }
}