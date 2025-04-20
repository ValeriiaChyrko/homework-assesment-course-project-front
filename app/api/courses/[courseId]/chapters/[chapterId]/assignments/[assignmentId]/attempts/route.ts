import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const {courseId, chapterId, assignmentId} = await params;

        if (!courseId) {
            console.warn("[ATTEMPTS] GET: Missing courseId in params");
            return NextResponse.json({ attempts: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ATTEMPTS] GET: Missing chapterId in params");
            return NextResponse.json({ attempts: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ATTEMPTS] GET: Missing assignmentId in params");
            return NextResponse.json({ attempts: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[ATTEMPTS] GET: No token found");
            return NextResponse.json({ attempts: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts`,
        });

        return NextResponse.json({ attempts: data }, { status });
    } catch (e) {
        console.error("[ATTEMPTS] GET: ", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const {courseId, chapterId, assignmentId} = await params;

        if (!courseId) {
            console.warn("[ATTEMPTS] POST: Missing courseId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ATTEMPTS] POST: Missing chapterId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ATTEMPTS] POST: Missing assignmentId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[ATTEMPTS] POST: No token found");
            return NextResponse.json({ attempt: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts`,
        });

        return NextResponse.json({ attempt: data }, { status });
    } catch (e) {
        console.error("[ATTEMPTS] POST:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}