import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;

        if (!courseId) {
            console.warn("[REORDER CHAPTER] PUT: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { list } = await req.json();

        if (!token || !userId) {
            console.error("PUT_CHAPTER: No token or userId found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/reorder`;
        const { status } = await fetchWithAuth({
            method: "PUT",
            token,
            url,
            payload: list,
        });

        if (status !== 200) {
            return new NextResponse("Internal Server Error", { status });
        }

        return new NextResponse("OK", { status: 200 });
    } catch (e) {
        console.error("[REORDER CHAPTER] PUT: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}