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
        const getCourseWithPublishedChapters = async () => {
            try {
                const {courseId} = await params;
                setCourseId(courseId);
                const response = await axios.get(`/api/courses/${courseId}/chapters`);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        getCourseWithPublishedChapters().then();
    }, [params]);

    if (!course) {
        return <div>Loading...</div>;
    }

    return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
}

export default CourseIdPage;