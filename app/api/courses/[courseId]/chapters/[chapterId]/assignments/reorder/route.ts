import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string, chapterId: string }> }
) {
    try {
        const { courseId, chapterId } = await params;

        if (!courseId) {
            console.warn("[REORDER ASSIGNMENTS] PUT: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[REORDER ASSIGNMENTS] PUT: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[REORDER ASSIGNMENTS] PUT: No access token");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const { list } = await req.json();

        const { status } = await fetchWithAuth({
            method: "PUT",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/reorder`,
            payload: list,
        });

        return new NextResponse("OK", { status });
    } catch (error) {
        console.error("[REORDER ASSIGNMENTS] PUT: Unexpected error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}