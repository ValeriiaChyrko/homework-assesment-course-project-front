import { getServerSession } from "next-auth/next";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PATCH(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string, attemptId: string }> }) {
    try {
        const {courseId, chapterId, assignmentId, attemptId} = await params;

        if (!courseId) {
            console.warn("[ATTEMPTS] FINISH: Missing courseId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ATTEMPTS] FINISH: Missing chapterId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ATTEMPTS] FINISH: Missing assignmentId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!attemptId) {
            console.warn("[ATTEMPTS] FINISH: Missing assignmentId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[ATTEMPTS] PATCH: No token found");
            return NextResponse.json({ attempt: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}/finish`,
        });

        return NextResponse.json({ attempt: data }, { status });
    } catch (e) {
        console.error("[ATTEMPTS] PATCH:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
