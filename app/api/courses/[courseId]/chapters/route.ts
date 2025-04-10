import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[CHAPTERS] POST: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { title } = await req.json();

        if (!token || !userId) {
            console.error("POST_CHAPTER: No token or userId found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters`,
            payload: {
                title,
                userId
            },
        });

        return NextResponse.json({ chapter: data }, { status });
    } catch (e) {
        console.error("[CHAPTERS] POST: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}