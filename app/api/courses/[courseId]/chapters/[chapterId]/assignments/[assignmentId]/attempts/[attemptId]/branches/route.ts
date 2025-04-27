import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function POST(req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string, attemptId: string }> }) {
    try {
        const {courseId, chapterId, assignmentId, attemptId} = await params;

        if (!courseId) {
            console.warn("[ATTEMPTS] GET BRANCHES: Missing courseId in params");
            return NextResponse.json({ branches: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ATTEMPTS] GET BRANCHES: Missing chapterId in params");
            return NextResponse.json({ branches: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ATTEMPTS] GET BRANCHES: Missing assignmentId in params");
            return NextResponse.json({ branches: null }, { status: 400 });
        }

        if (!attemptId) {
            console.warn("[ATTEMPTS] GET BRANCHES: Missing assignmentId in params");
            return NextResponse.json({ branches: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[ATTEMPTS] GET BRANCHES: No token found");
            return NextResponse.json({ branches: null }, { status: 401 });
        }

        const { assignment } = await req.json();

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}/branches`,
            payload: {
                repoTitle: assignment.repositoryName,
                ownerGitHubUsername: assignment.repositoryOwner,
                authorGitHubUsername: session.user.github_login,
            },
        });

        return NextResponse.json({ branches: data }, { status });
    } catch (e) {
        console.error("[ASSIGNMENT]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}