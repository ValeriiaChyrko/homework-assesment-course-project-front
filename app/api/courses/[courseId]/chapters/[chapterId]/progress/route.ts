import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const {courseId, chapterId} = await params;

        if (!courseId) {
            console.warn("[CHAPTER USER PROGRESS] GET: Missing courseId in params");
            return NextResponse.json({ userProgress: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[CHAPTER USER PROGRESS] GET: Missing chapterId in params");
            return NextResponse.json({ userProgress: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[CHAPTER USER PROGRESS] GET: No token found");
            return NextResponse.json({ userProgress: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/progress`,
        });

        if (!data) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json({ userProgress: data }, { status });
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_PROGRESS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const {courseId, chapterId} = await params;

        if (!courseId) {
            console.warn("[CHAPTER USER PROGRESS] PUT: Missing courseId in params");
            return NextResponse.json({ userProgress: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[CHAPTER USER PROGRESS] PUT: Missing chapterId in params");
            return NextResponse.json({ userProgress: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const { isCompleted } = await req.json();

        if (!token) {
            console.error("[CHAPTER USER PROGRESS] PUT: No token found");
            return NextResponse.json({ userProgress: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PUT",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/progress`,
            payload: {isCompleted}
        });

        return NextResponse.json({ userProgress: data }, { status });
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_PROGRESS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}