import { NextResponse } from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

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
                assignment: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_ASSIGNMENT: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                assignment: null
            });
        }

        const assignment = await apiResponse.json();
        return NextResponse.json(assignment);
    } catch (e) {
        console.error("[ASSIGNMENT]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId } = await params;

        if (!token || !userId) {
            console.error("GET_CHAPTER: No token or userId found");
            return {
                chapter: null
            };
        }

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}?${queryParams.toString()}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const deletedCourse = await apiResponse.json();
        return NextResponse.json(deletedCourse);
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_ID_DELETE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string; assignmentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId, assignmentId } = await params;
        const { repositoryUrl, ...values } = await req.json();

        if (!token || !userId) {
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

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId,
                ...updateData
            })
        });

        if (!apiResponse.ok) {
            const errorMessage = await apiResponse.text();
            console.error("API Error:", errorMessage);
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const chapter = await apiResponse.json();
        return NextResponse.json(chapter);
    } catch (e) {
        console.error("[CHAPTER_ASSIGNMENT_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}