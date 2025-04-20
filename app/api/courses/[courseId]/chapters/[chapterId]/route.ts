import { NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const {courseId, chapterId} = await params;

        if (!courseId) {
            console.warn("[CHAPTER] GET: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[CHAPTER] GET: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[CHAPTER] GET: No token found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`,
        });

        return NextResponse.json({ chapter: data }, { status });
    } catch (e) {
        console.error("[CHAPTER] GET: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const {courseId, chapterId} = await params;

        if (!courseId) {
            console.warn("[COURSES_CHAPTER_ID_DELETE]: Missing courseId in params");
            return NextResponse.json({ id: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[COURSES_CHAPTER_ID_DELETE]: Missing chapterId in params");
            return NextResponse.json({ id: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[COURSES_CHAPTER_ID_DELETE]: No token found");
            return NextResponse.json({ id: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "DELETE",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`,
        });

        return NextResponse.json({ id: data }, { status });
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_DELETE] Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const {courseId, chapterId} = await params;

        if (!courseId) {
            console.warn("[COURSES_CHAPTER_ID_PATCH]: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[COURSES_CHAPTER_ID_PATCH]: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const values = await req.json();

        if (!token) {
            console.error("[COURSES_CHAPTER_ID_PATCH]: No token found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`,
            payload: values
        });

        return NextResponse.json({ chapter: data }, { status });
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_PATCH] Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}