import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    try {
        const { courseId, chapterId } = await params;

        if (!courseId) {
            console.warn("[CHAPTER] GET NEXT: Missing courseId in params");
            return NextResponse.json({ nextChapter: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[CHAPTER] GET NEXT: Missing courseId in params");
            return NextResponse.json({ nextChapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[CHAPTER] GET NEXT: No token found");
            return NextResponse.json({ nextChapter: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/next`,
        });

        if (!data) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json({ nextChapter: data }, { status });
    } catch (e) {
        console.error("[CHAPTER] GET NEXT: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}