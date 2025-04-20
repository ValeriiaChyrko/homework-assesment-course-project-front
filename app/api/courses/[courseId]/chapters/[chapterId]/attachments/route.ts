import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId:string }> }) {
    try {
        const { courseId, chapterId } = await params;

        if (!courseId) {
            console.warn("[CHAPTER_ID_ATTACHMENTS] GET: Missing courseId in params");
            return NextResponse.json({ attachments: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[CHAPTER_ID_ATTACHMENTS] GET: Missing chapterId in params");
            return NextResponse.json({ attachments: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[CHAPTER_ID_ATTACHMENTS] GET: No access token");
            return NextResponse.json({ attachments: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/attachments`,
        });

        return NextResponse.json({ attachments: data }, { status });
    } catch (error) {
        console.error("[CHAPTER_ID_ATTACHMENTS] GET: Unexpected error", error);
        return NextResponse.json({ attachments: null }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string, chapterId:string }> }) {
    try {
        const { courseId, chapterId } = await params;

        if (!courseId) {
            console.warn("[CHAPTER_ID_ATTACHMENTS] POST: Missing courseId in params");
            return NextResponse.json({ attachment: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[CHAPTER_ID_ATTACHMENTS] POST: Missing chapterId in params");
            return NextResponse.json({ attachment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[CHAPTER_ID_ATTACHMENTS] POST: No access token");
            return NextResponse.json({ attachment: null }, { status: 401 });
        }

        const { url, name, key } = await req.json();

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/attachments`,
            payload: {
                courseId,
                chapterId,
                url,
                name,
                key
            },
        });

        return NextResponse.json({ attachment: data }, { status });
    } catch (error) {
        console.error("[CHAPTER_ID_ATTACHMENTS] POST: Unexpected error", error);
        return NextResponse.json({ attachment: null }, { status: 500 });
    }
}