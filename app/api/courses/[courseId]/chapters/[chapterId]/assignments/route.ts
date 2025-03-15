import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";


export async function POST(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } },
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;
        const { title } = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                chapter: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/assignments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                userId
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const assignment = await apiResponse.json();
        return NextResponse.json(assignment);
    } catch (e) {
        console.error("[ASSIGNMENTS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}