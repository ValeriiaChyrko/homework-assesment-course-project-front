import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;

        if (!courseId) {
            console.warn("[COURSE] GET PROGRESS: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[COURSE] GET PROGRESS: No token found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const queryParams = new URLSearchParams([
            ["Include", "chapters"],
            ["Include", "student-progress"],
            ["Include", "chapter-progress"],
        ]);

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/progress?${queryParams}`,
        });

        return NextResponse.json({ course: data }, { status });
    } catch (e) {
        console.error("[COURSE] GET PROGRESS: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}