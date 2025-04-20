import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[CHAPTERS] GET: Missing courseId in params");
            return NextResponse.json({ chapters: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("GET_CHAPTERS: No token found");
            return NextResponse.json({ chapters: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters`
        });

        return NextResponse.json({ chapters: data }, { status });
    } catch (e) {
        console.error("[CHAPTERS] GET: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[CHAPTERS] POST: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const { title } = await req.json();

        if (!token) {
            console.error("POST_CHAPTER: No token found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters`,
            payload: {
                title
            },
        });

        return NextResponse.json({ chapter: data }, { status });
    } catch (e) {
        console.error("[CHAPTER] POST: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}