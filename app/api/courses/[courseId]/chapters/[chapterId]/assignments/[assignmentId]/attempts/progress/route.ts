import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[ATTEMPT PROGRESS] GET: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ATTEMPT PROGRESS] GET: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ATTEMPT PROGRESS] GET: Missing assignmentId in params");
            return NextResponse.json({ assignment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[ATTEMPT PROGRESS] GET: No token found");
            return NextResponse.json({ assignment: null });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/progress`,
        });

        if (!data) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json({ userProgress: data }, { status });
    } catch (e) {
        console.error("[ATTEMPT PROGRESS] GET:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
