import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import {jwtDecode} from "jwt-decode";

interface AccessTokenData {
    login: string;
    avatar_url: string;
}

export async function POST(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string; attemptId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId, attemptId } = await params;
        const { assignment } = await req.json();

        if (!token || !userId) {
            console.error("GET_ASSIGNMENT: No token or userId found");
            return {
                branches: []
            };
        }

        const decodedToken: AccessTokenData = jwtDecode(token);

        const queryParams = new URLSearchParams({userId});
        queryParams.append("RepoTitle", assignment.repositoryName);
        queryParams.append("OwnerGitHubUsername", assignment.repositoryOwner);
        queryParams.append("AuthorGitHubUsername", decodedToken.login);

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}/branches?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_ASSIGNMENT: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                branches: []
            });
        }

        const branches:string[] = await apiResponse.json();
        return NextResponse.json(branches);
    } catch (e) {
        console.error("[ASSIGNMENT]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}