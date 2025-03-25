import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type EnrolledWithCourse = Enrollment & {
    course: Course;
};

const groupByCourse = (enrollments: EnrolledWithCourse[]) => {
    const grouped: { [courseTitle: string]: number} = {};

    enrollments.forEach((enrollment) => {
        const courseTitle = enrollment.course.title;

        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += 1;
    });

    return grouped;
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        if (!token || !userId) {
            console.error("GET_COURSES: No token or userId found");
            return NextResponse.json({
                enrolledCourses: [],
                totalStudents: 0
            });
        }

        const queryParams = new URLSearchParams({userId});
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/enrollments?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!apiResponse.ok) {
            console.error("GET_COURSES: Failed to fetch courses", apiResponse.status);
            return NextResponse.json({
                enrolledCourses: [],
                totalStudents: 0
            });
        }

        const enrollments = await apiResponse.json();
        const groupedStudents = groupByCourse(enrollments);
        const enrolledCourses = Object.entries(groupedStudents).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalStudents = enrollments.length;

        return NextResponse.json({
            enrolledCourses,
            totalStudents
        });

    } catch (e) {
        console.error("GET_DASHBOARD_COURSES", e);
        return NextResponse.json({
            enrolledCourses: [],
            totalStudents: 0
        });
    }
}