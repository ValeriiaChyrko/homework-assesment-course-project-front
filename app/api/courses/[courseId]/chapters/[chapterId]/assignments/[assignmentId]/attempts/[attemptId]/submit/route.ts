import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import {jwtDecode} from "jwt-decode";

interface AccessTokenData {
    login: string;
    avatar_url: string;
}

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string; attemptId: string } },
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId, attemptId } = await params;
        const { attempt, assignment } = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attempt: null
            };
        }

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attempt: null
            };
        }

        const decodedToken: AccessTokenData = jwtDecode(token);

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}/submit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                UserId: userId,
                AuthorGitHubUsername: decodedToken.login,
                Attempt: {
                    ...attempt
                },
                Assignment: {
                    ...assignment
                }
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        return new NextResponse("OK", { status: 200 });
    } catch (e) {
        console.error("[ASSIGNMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}