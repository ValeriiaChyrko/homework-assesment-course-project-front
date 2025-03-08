import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        const { courseId } = await params;
        const { attachmentId } = await params;

        if (!token || !userId) {
            console.error("GET_COURSE: No token or userId found");
            return {
                courses: []
            };
        }

        const queryParams = new URLSearchParams({ userId });

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/attachments/${attachmentId}?${queryParams.toString()}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                courseId: courseId,
                attachmentId: attachmentId,
            })
        });

        if (!apiResponse.ok) {
            return new NextResponse("Internal Server Error", { status: apiResponse.status });
        }

        const deletedAttachment = await apiResponse.json();
        return NextResponse.json(deletedAttachment);
    } catch (e) {
        console.error("[ATTACHMENT_ID]", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}