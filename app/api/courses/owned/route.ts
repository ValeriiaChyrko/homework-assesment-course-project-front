import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

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

        const { data, status, error } = await fetchWithAuth<{
            items: CourseWithCategory[];
            totalCount: number;
            page: number;
            pageSize: number;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
        }>({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/owned?${queryParams.toString()}`,
        });

        if (!data) {
            console.error("GET_COURSES: Fetch failed", status, error);
            return NextResponse.json(
                { courses: [], totalCount: 0, page, pageSize, hasPreviousPage: false, hasNextPage: false },
                { status }
            );
        }

        const courses = data.items.map((item: CourseWithCategory) => ({
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
            totalCount: data.totalCount,
            page: data.page,
            pageSize: data.pageSize,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage,
        });
    } catch (error) {
        console.error("GET_COURSES: Unexpected error", error);
        return NextResponse.json(
            { courses: [], totalCount: 0, page: 1, pageSize: 10, hasPreviousPage: false, hasNextPage: false },
            { status: 500 }
        );
    }
}