import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[COURSE_ENROLLMENT] GET: Missing courseId in params");
            return NextResponse.json({ enrollment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[COURSE_ENROLLMENT] GET: No token found");
            return NextResponse.json({ enrollment: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/enrollments`,
        });

        if (!data) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json({ enrollment: data }, { status });
    } catch (e) {
        console.error("[COURSE_ENROLLMENT] GET:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[COURSE_ENROLLMENT] POST: Missing courseId in params");
            return NextResponse.json({ enrollment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[COURSE_ENROLLMENT] POST: No token found");
            return NextResponse.json({ enrollment: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "POST",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/enrollments`,
        });

        return NextResponse.json({ enrollment: data }, { status });
    } catch (e) {
        console.error("[COURSE_ENROLLMENT] POST:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}