import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;

        if (!token || !userId) {
            console.error("GET_CHAPTER: No token or userId found");
            return {
                chapter: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_CHAPTER: Failed to fetch chapter", apiResponse.status);
            return NextResponse.json({
                chapter: null
            });
        }

        const chapter = await apiResponse.json();
        return NextResponse.json(chapter);
    } catch (e) {
        console.error("[CHAPTER]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}