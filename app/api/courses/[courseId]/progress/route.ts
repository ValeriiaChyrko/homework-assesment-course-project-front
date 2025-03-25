import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId } = await params;

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                course: null,
                progressCount: 0
            };
        }

        const queryParams = new URLSearchParams();
        queryParams.append("UserId", userId);

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/progress?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_COURSES: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                course: null,
                progressCount: 0
            });
        }

        const course: Course & {
            category: Category;
            chapters: Chapter & {userProgress: UserChapterProgress | null;}[];
            progress: number;
            isEnrolled: boolean;
        } = await apiResponse.json();

        return NextResponse.json({
            course: course,
            progressCount: course.progress
        });
    } catch (e) {
        console.error("[COURSE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}