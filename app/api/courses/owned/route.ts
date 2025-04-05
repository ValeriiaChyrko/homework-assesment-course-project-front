import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type CourseWithCategory = Course & {
    category: Category | null;
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
        const page = Number(url.searchParams.get("page") || 1);
        const pageSize = Number(url.searchParams.get("pageSize") || 100);

        const queryParams = new URLSearchParams();
        queryParams.append("PageNumber", page.toString());
        queryParams.append("PageSize", pageSize.toString());
        queryParams.append("Include", "category");

        const apiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/courses/owned?${queryParams.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error("GET_COURSES: Fetch failed", apiResponse.status, errorText);
            return NextResponse.json(
                { courses: [], totalCount: 0, page, pageSize, hasPreviousPage: false, hasNextPage: false },
                { status: apiResponse.status }
            );
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

        return NextResponse.json({
            courses,
            totalCount: responseData.totalCount,
            page: responseData.page,
            pageSize: responseData.pageSize,
            hasPreviousPage: responseData.hasPreviousPage,
            hasNextPage: responseData.hasNextPage,
        });
    } catch (error) {
        console.error("GET_COURSES: Unexpected error", error);
        return NextResponse.json(
            { courses: [], totalCount: 0, page: 1, pageSize: 10, hasPreviousPage: false, hasNextPage: false },
            { status: 500 }
        );
    }
}