import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PUT(req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string, attemptId: string }> }) {
    try {
        const {courseId, chapterId, assignmentId, attemptId} = await params;

        if (!courseId) {
            console.warn("[ATTEMPTS] SUBMIT: Missing courseId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ATTEMPTS] SUBMIT: Missing chapterId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ATTEMPTS] SUBMIT: Missing assignmentId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        if (!attemptId) {
            console.warn("[ATTEMPTS] SUBMIT: Missing assignmentId in params");
            return NextResponse.json({ attempt: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const { attempt, assignment } = await req.json();

        if (!token) {
            console.error("[ATTEMPTS] SUBMIT: No token found");
            return NextResponse.json({ attempt: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PUT",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}/submit`,
            payload: {
                AuthorGitHubUsername: session.user.login,
                Attempt: {
                    ...attempt
                },
                Assignment: {
                    ...assignment
                }
            },
        });

        return NextResponse.json({ attempt: data }, { status });
    } catch (e) {
        console.error("[ASSIGNMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}