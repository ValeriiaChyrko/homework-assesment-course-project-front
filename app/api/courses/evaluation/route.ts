import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type CourseWithUserProgress= Course & {
    chapters: Chapter  & {
        assignments: Assignment & {
            attemptProgress: UserProgress[] | []
        }[] | []
    }[] | [];
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const userId = session?.user?.id;

        if (!token || !userId) {
            console.error("GET_COURSES: No token or userId found");
            return NextResponse.json({
                courses: []
            });
        }

        const queryParams = new URLSearchParams({userId});

        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/evaluation?${queryParams.toString()}`, {
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

        const courses: CourseWithUserProgress[] = await apiResponse.json();
        const totalAttempts = courses.reduce((courseAcc, course) => {
            return courseAcc + course.chapters.reduce((chapterAcc, chapter) => {
                return chapterAcc + chapter.assignments.reduce((assignmentAcc, assignment) => {
                    return assignmentAcc + assignment.attemptProgress.length;
                }, 0);
            }, 0);
        }, 0);

        return {
            courses,
            totalAttempts
        };

    } catch (e) {
        console.error("GET_DASHBOARD_COURSES", e);
        return NextResponse.json({
            courses: [],
            totalAttempts: 0
        });
    }
}