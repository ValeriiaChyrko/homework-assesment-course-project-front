import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PATCH(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const { courseId } = await params;

        if (!courseId) {
            console.warn("[COURSE] PUBLISH: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("COURSE PATCH: No token found");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/publish`,
        });

        return NextResponse.json({ assignment: data }, { status });
    } catch (e) {
        console.error("[COURSE_PUBLISH]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}