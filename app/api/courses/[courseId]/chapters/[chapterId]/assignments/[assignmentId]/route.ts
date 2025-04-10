import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENT] GET: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENT] GET: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ASSIGNMENT] GET: Missing assignmentId in params");
            return NextResponse.json({ assignment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("GET_ASSIGNMENT: No token found");
            return NextResponse.json({ assignment: null });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`,
        });

        return NextResponse.json({ assignment: data }, { status });
    } catch (e) {
        console.error("[ASSIGNMENT]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENT] DELETE: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENT] DELETE: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ASSIGNMENT] DELETE: Missing assignmentId in params");
            return NextResponse.json({ assignment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("GET_CHAPTER: No token found");
            return NextResponse.json({ chapter: null });
        }

        const { data, status } = await fetchWithAuth({
            method: "DELETE",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`,
        });

        return NextResponse.json({ assignmentId: data }, { status });
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_ID_DELETE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[ASSIGNMENT] PATCH: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[ASSIGNMENT] PATCH: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[ASSIGNMENT] PATCH: Missing assignmentId in params");
            return NextResponse.json({ assignment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const { repositoryUrl, ...values } = await req.json();

        if (!token) {
            console.error("PATCH: No token or userId found");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const extractRepoData = (url: string) => {
            if (url) {
                const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\.git)?/;
                const match = url.match(regex);
                if (match) {
                    return {
                        repositoryOwner: match[1],
                        repositoryName: match[2].replace(/\.git$/, ''),
                    };
                }
            }
            return { repositoryOwner: '', repositoryName: '' };
        };

        const { repositoryOwner, repositoryName } = extractRepoData(repositoryUrl);

        const updateData = {
            ...values,
            ...(repositoryUrl && { repositoryUrl }),
            ...(repositoryOwner && { repositoryOwner }),
            ...(repositoryName && { repositoryName }),
        };

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`,
            payload: {
                ...updateData,
            },
        });

        return NextResponse.json({ assignment: data }, { status });
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}