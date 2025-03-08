import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    const userId = session?.user?.id;

    if (!userId || !token) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/roles/teacher`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!apiResponse.ok) {
        return new NextResponse("Internal Server Error", { status: apiResponse.status });
    }

    const isTeacher = await apiResponse.json();
    return NextResponse.json(isTeacher);
}