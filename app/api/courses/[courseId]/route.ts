import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function GET(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("GET_COURSE: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("GET_COURSE: No access token");
            return NextResponse.json({ course: null }, { status: 401 });
        }

        const queryParams = new URLSearchParams([
            ["Include", "category"],
            ["Include", "chapters"],
            ["Include", "attachments"],
        ]);

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}?${queryParams}`,
        });

        return NextResponse.json({ course: data }, { status });
    } catch (error) {
        console.error("GET_COURSE: Unexpected error", error);
        return NextResponse.json({ course: null }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("DELETE_COURSE: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("DELETE_COURSE: No access token");
            return NextResponse.json({ course: null }, { status: 401 });
        }

        const { data, status } = await fetchWithAuth({
            method: "DELETE",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`,
        });

        return NextResponse.json({ course: data }, { status });
    } catch (error) {
        console.error("DELETE_COURSE: Unexpected error", error);
        return NextResponse.json({ course: null }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
    try {
        const {courseId} = await params;

        if (!courseId) {
            console.warn("PATCH_COURSE: Missing courseId in params");
            return NextResponse.json({ course: null }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("PATCH_COURSE: No access token");
            return NextResponse.json({ course: null }, { status: 401 });
        }

        const values = await req.json();

        const { data, status } = await fetchWithAuth({
            method: "PATCH",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}`,
            payload: values,
        });

        return NextResponse.json({ course: data }, { status });
    } catch (error) {
        console.error("PATCH_COURSE: Unexpected error", error);
        return NextResponse.json({ course: null }, { status: 500 });
    }
}