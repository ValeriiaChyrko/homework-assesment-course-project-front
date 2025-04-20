import { jwtDecode } from "jwt-decode";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {authOptions} from "@/app/api/auth/[...nextauth]/auth-options";

interface AccessTokenData {
    groups: string[];
}

export async function GET() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const decodedToken:AccessTokenData = jwtDecode(token);
    const groups = decodedToken.groups || [];

    const isTeacher = groups.includes("Teachers");

    return new Response(JSON.stringify({ isTeacher }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}