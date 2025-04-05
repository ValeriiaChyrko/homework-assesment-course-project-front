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

        const queryParams = new URLSearchParams();
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts?${queryParams.toString()}`, {
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

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId } = await params;

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attempt: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                assignmentId: assignmentId
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