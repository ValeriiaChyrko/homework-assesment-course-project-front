import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, assignmentId: string }> }) {
    try {
        const { courseId, chapterId, assignmentId } = await params;

        if (!courseId) {
            console.warn("[GET_ASSIGNMENT] analytics: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!chapterId) {
            console.warn("[GET_ASSIGNMENT] analytics: Missing chapterId in params");
            return NextResponse.json({ chapter: null }, { status: 400 });
        }

        if (!assignmentId) {
            console.warn("[GET_ASSIGNMENT] analytics: Missing assignmentId in params");
            return NextResponse.json({ assignment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[GET_ASSIGNMENT] analytics: No access token");
            return NextResponse.json(
                { analysis: [], totalStudents: 0 },
                { status: 401 }
            );
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/statistics`,
        });

        if (!data) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json({ analytics: data }, { status });
    } catch (e) {
        console.error("[GET_ASSIGNMENT] analytics:", e);
        return NextResponse.json({
            analysis: [],
            totalStudents: 0
        });
    }
}