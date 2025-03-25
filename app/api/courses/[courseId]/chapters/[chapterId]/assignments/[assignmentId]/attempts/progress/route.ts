import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId } = await params;

        if (!token || !userId) {
            console.error("GET_ASSIGNMENT: No token or userId found");
            return {
                attempts: []
            };
        }

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/progress?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_ASSIGNMENT: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                attempts: []
            });
        }

        const attempts:Attempt[] = await apiResponse.json();
        return NextResponse.json(attempts);
    } catch (e) {
        console.error("[ASSIGNMENT]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
