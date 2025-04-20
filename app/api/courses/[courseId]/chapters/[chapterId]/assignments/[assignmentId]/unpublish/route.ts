import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PATCH(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENT] UNPUBLISH: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENT] UNPUBLISH: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ASSIGNMENT] UNPUBLISH: Missing assignmentId in params");
            return NextResponse.json({ assignment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("PATCH: No token found");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/unpublish`,
        });

        return NextResponse.json({ assignment: data }, { status });
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_UNPUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}