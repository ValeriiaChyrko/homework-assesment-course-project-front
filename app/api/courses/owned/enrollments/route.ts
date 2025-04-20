import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {fetchWithAuth} from "@/lib/fetchWithAuth";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.warn("[GET_COURSES] enrollments: No access token");
            return NextResponse.json(
                { analysis: [], totalStudents: 0 },
                { status: 401 }
            );
        }

        const { data, status } = await fetchWithAuth({
            method: "GET",
            token,
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/courses/enrollments/statistics`,
        });

        if (!data) {
            return new NextResponse(null, { status: 204 });
        }

        return NextResponse.json({ analytics: data }, { status });
    } catch (e) {
        console.error("[GET_COURSES] enrollments:", e);
        return NextResponse.json({
            analysis: [],
            totalStudents: 0
        });
    }
}