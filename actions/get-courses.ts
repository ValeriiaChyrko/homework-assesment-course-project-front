import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCoursesProps = {
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
                                     title,
                                     categoryId,
                                 }: GetCoursesProps): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id ?? '';

        if (!token) {
            console.error("GET_COURSES: No token found");
            return [];
        }

        const queryParams = new URLSearchParams({ userId });
        if (title) queryParams.append("title", title);
        if (categoryId) queryParams.append("categoryId", categoryId);
        queryParams.append("Include", "category");
        queryParams.append("Include", "progress");

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_COURSES: Failed to fetch courses", apiResponse.status);
            return [];
        }

        return await apiResponse.json();
    } catch (e) {
        console.error("GET_COURSES_ERROR", e);
        return [];
    }
};