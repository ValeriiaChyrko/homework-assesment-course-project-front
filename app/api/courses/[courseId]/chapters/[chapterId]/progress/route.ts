import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

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

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/progress?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            const errorMessage = await apiResponse.text();
            console.error("API Error:", errorMessage);
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const progress:UserChapterProgress | null = await apiResponse.json();
        return NextResponse.json(progress);
    } catch (e) {
        console.error("[COURSES_CHAPTER_ID_PROGRESS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId, chapterId } = await params;
        const { isCompleted } = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                attachment: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/progress`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId,
                chapterId,
                isCompleted
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
        console.error("[COURSES_CHAPTER_ID_PROGRESS]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}