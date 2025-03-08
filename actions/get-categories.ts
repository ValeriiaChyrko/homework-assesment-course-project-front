import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getCategories = async (): Promise<Category[]> => {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            console.error("GET_COURSES: No token found");
            return [];
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
            return [];
        }

        return await apiResponse.json();
    } catch (e) {
        console.error("GET_CATEGORIES_ERROR", e);
        return [];
    }
};