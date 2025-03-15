import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string; } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId } = await params;

        if (!token || !userId) {
            console.error("PATCH: No token or userId found");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/unpublish?${queryParams.toString()}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            }
        });

        if (!apiResponse.ok) {
            const errorMessage = await apiResponse.text();
            console.error("API Error:", errorMessage);
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const chapter = await apiResponse.json();
        return NextResponse.json(chapter);
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}