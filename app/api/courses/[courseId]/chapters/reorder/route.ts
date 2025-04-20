import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PUT(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[COURSES_CHAPTER_REORDER]: Missing courseId in params");
            return NextResponse.json({ id: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const { list } = await req.json();

        if (!token) {
            console.error("[COURSES_CHAPTER_REORDER]: No token found");
            return NextResponse.json({ id: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PUT",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/reorder`,
            payload: list
        });

        return NextResponse.json({ id: data }, { status });
    } catch (e) {
        console.error("[REORDER CHAPTER] PUT: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}