import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attachment: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/attachments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            }
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const attachment = await apiResponse.json();
        return NextResponse.json(attachment);
    } catch (e) {
        console.error("[CHAPTER_ID_ATTACHMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;
        const { url, name } = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attachment: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/attachments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                courseId: courseId,
                chapterId: chapterId,
                url: url,
                name: name,
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const attachment = await apiResponse.json();
        return NextResponse.json(attachment);
    } catch (e) {
        console.error("[CHAPTER_ID_ATTACHMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}