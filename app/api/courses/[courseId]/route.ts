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
                course: null
            };
        }

        const queryParams = new URLSearchParams();
        queryParams.append("OwnerId", userId);
        queryParams.append("Include", "chapters");
        queryParams.append("Include", "attachments");

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_COURSES: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                course: null
            });
        }

        const course = await apiResponse.json();
        return NextResponse.json(course);
    } catch (e) {
        console.error("[COURSE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
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
                course: null
            };
        }

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}?${queryParams.toString()}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                courseId: courseId,
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const deletedCourse = await apiResponse.json();
        return NextResponse.json(deletedCourse);
    } catch (e) {
        console.error("[COURSE_DELETE]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId } = await params;
        const values = await req.json();

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                course: null
            };
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId: userId,
                ...values,
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const course = await apiResponse.json();
        return NextResponse.json(course);
    } catch (e) {
        console.error("[COURSE_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}