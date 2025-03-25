import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string; attemptId: string } },
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId, attemptId } = await params;
        const values = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attempt: null
            };
        }

        console.log("VALUES", { values });

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                ...values,
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const createdAttempt:Attempt = await apiResponse.json();
        return NextResponse.json(createdAttempt);
    } catch (e) {
        console.error("[ASSIGNMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}