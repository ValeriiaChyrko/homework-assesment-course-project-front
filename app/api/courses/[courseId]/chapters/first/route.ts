import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;

        if (!courseId) {
            console.warn("[CHAPTER] GET: Missing courseId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[CHAPTER] GET: No token found");
            return NextResponse.json({ chapter: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/first`,
        });

        return NextResponse.json({ chapter: data }, { status });
    } catch (e) {
        console.error("[CHAPTER] GET: Unexpected error", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}