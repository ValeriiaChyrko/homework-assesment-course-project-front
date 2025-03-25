import { NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;

        if (!token || !userId) {
            console.error("GET_CHAPTER: No token or userId found");
            return {
                chapter: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_CHAPTER: Failed to fetch chapter", apiResponse.status);
            return NextResponse.json({
                chapter: null
            });
        }

        const chapter = await apiResponse.json();
        return NextResponse.json(chapter);
    } catch (e) {
        console.error("[CHAPTER]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;

        if (!token || !userId) {
            console.error("GET_CHAPTER: No token or userId found");
            return {
                chapter: null
            };
        }

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}?${queryParams.toString()}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const deletedCourse = await apiResponse.json();
        return NextResponse.json(deletedCourse);
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_DELETE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;
        const {...values } = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                chapter: null
            };
        }

        const apiChapterResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                ...values,
            })
        });

        if (!apiChapterResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiChapterResponse.status });
        }

        const chapter = await apiChapterResponse.json();
        return NextResponse.json(chapter);
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}