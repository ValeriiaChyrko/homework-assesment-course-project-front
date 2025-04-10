import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function PATCH(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENT] PUBLISH: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENT] PUBLISH: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ASSIGNMENT] PUBLISH: Missing assignmentId in params");
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/publish`,
        });

        return NextResponse.json({ assignment: data }, { status });
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
