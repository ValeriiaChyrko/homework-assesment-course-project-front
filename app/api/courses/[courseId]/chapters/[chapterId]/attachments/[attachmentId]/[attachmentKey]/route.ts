import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {UTApi} from "uploadthing/server";

export async function DELETE(_req: Request, { params }: { params: Promise<{ courseId: string, chapterId: string, attachmentId: string, attachmentKey: string }> }) {
    try {
        const { courseId, chapterId, attachmentId, attachmentKey } = await params;

        if (!courseId) {
            console.warn("[CHAPTER_ATTACHMENT_ID]: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!attachmentId) {
            console.warn("[CHAPTER_ATTACHMENT_ID]: Missing attachmentId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        if (!attachmentKey) {
            console.warn("[CHAPTER_ATTACHMENT_ID]: Missing attachmentKey in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[CHAPTER_ATTACHMENT_ID]: No access token");
            return NextResponse.json({ attachment: null }, { status: 401 });
        }

        const utApi = new UTApi({
            token: process.env.UPLOADTHING_TOKEN,
        });
        const deleteResponse = await utApi.deleteFiles(attachmentKey);

        if (!deleteResponse.success) {
            console.error("[CHAPTER_ATTACHMENT_ID] DELETE: Failed to delete attachment from Uploadthing");
            return NextResponse.json({ attachment: null }, { status: 500 });
        }

        const { data, status } = await fetchWithAuth({
            method: "DELETE",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/chapters/${chapterId}/attachments/${attachmentId}`,
            payload: {
                courseId,
                attachmentId,
            },
        });

        return NextResponse.json({ attachment: data }, { status });
    } catch (error) {
        console.error("[CHAPTER_ATTACHMENT_ID] DELETE: Unexpected error", error);
        return NextResponse.json({ attachment: null }, { status: 500 });
    }
}