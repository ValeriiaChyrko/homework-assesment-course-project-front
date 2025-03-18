"use client"

import {redirect} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";

const CourseIdPage = ({
    params
}: {
    params: { courseId: string; }
}) => {
    const [course, setCourse] = useState<Course & {
        chapters: Chapter[] | null;
    } | null>(null);
    const [courseId, setCourseId] = useState('');

    useEffect(() => {
        const getCourseWithProgressAndChapters = async () => {
            try {
                const { courseId } = await params;
                setCourseId(courseId);
                const response = await axios.get(`/api/courses/${courseId}/progress`);
                const data = response.data;
                setCourse(data.course || null);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        getCourseWithProgressAndChapters();
    }, [params]);

    if (!course) {
        return <div>Loading...</div>;
    }

    return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}

export default CourseIdPage;