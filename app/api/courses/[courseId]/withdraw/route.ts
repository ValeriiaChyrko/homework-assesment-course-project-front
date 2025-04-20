import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function PATCH(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("[COURSE_ENROLLMENT] WITHDRAW: Missing courseId in params");
            return NextResponse.json({ enrollment: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("[COURSE_ENROLLMENT] WITHDRAW: No token found");
            return NextResponse.json({ enrollment: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/enrollments/withdraw`,
        });

        return NextResponse.json({ enrollment: data }, { status });
    } catch (e) {
        console.error("[COURSE_WITHDRAW]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}