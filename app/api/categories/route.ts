import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("GET_CATEGORIES: No token found");
            return NextResponse.json({
                categories: []
            });
        }

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_CATEGORIES: Failed to fetch category", apiResponse.status);
            return NextResponse.json({
                categories: []
            });
        }

        const categories = await apiResponse.json();
        return NextResponse.json({
            categories
        });
    } catch (e) {
        console.error("GET_CATEGORIES", e);
        return NextResponse.json({
            categories: []
        });
    }
}