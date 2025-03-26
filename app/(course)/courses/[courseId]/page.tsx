"use client"

import {redirect} from "next/navigation";
import React, {useEffect} from "react";
import axios from "axios";

const CourseIdPage = ({
                          params,
                      }: {
    params: Promise<{ courseId: string }>;
}) => {
    const courseId = React.use(params).courseId;
    const [chapterId, setChapterId] = React.useState<string>('');

    useEffect(() => {
        const getCourseFirstChapterId = async () => {
            try {
                const response = await axios.get(`/api/courses/${courseId}/chapters/first`);
                const chapter:Chapter = response.data;
                setChapterId(chapter.id);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        getCourseFirstChapterId().then();
    }, [courseId]);

    if (!chapterId) return null;
    return redirect(`/courses/${courseId}/chapters/${chapterId}`);
}

export default CourseIdPage;