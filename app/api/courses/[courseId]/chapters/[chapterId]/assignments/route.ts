import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const { courseId, chapterId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENTS] GET: Missing courseId in params");
            return NextResponse.json({ assignments: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENTS] GET: Missing chapterId in params");
            return NextResponse.json({ assignments: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[ASSIGNMENTS] GET: No access token");
            return NextResponse.json({ assignments: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments`,
        });

        return NextResponse.json({ assignments: data }, { status });
    } catch (error) {
        console.error("[ASSIGNMENTS] GET: Unexpected error", error);
        return NextResponse.json({ chapter: null }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ courseId: string, chapterId: string }> }
) {
    try {
        const { courseId, chapterId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENTS] POST: Missing courseId in params");
            return NextResponse.json({ assignments: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENTS] POST: Missing chapterId in params");
            return NextResponse.json({ assignments: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[ASSIGNMENTS] POST: No access token or userId");
            return NextResponse.json({ assignments: null }, { status: 401 });
        }

        const { title } = await req.json();

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments`,
            payload: {
                title
            },
        });

        return NextResponse.json({ assignment: data }, { status });
    } catch (error) {
        console.error("[ASSIGNMENTS] POST: Unexpected error", error);
        return NextResponse.json({ chapter: null }, { status: 500 });
    }
}