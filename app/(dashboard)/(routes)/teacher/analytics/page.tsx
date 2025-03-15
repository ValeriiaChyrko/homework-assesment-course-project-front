"use client"

import {DataCard} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import { Chart } from "./_components/chart";
import {GraduationCap, School} from "lucide-react";
import {CourseTable} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/course-data-table";
import {useEffect, useState } from "react";
import axios from "axios";


const AnalyticsPage = () => {
    const [courses, setCourses] = useState([]);
    const [totalAttempts, setTotalAttempts] = useState(0);

    useEffect(() => {
        const getCourseAnalytics = async () => {
            try {
                const response = await axios.get('/api/courses/evaluation');
                setCourses(response.data.courses || []);
                setTotalAttempts(response.data.totalAttempts);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };

        getCourseAnalytics().then();
    }, []);

    const [enrollments, setEnrollments] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);

    useEffect(() => {
        const getEnrolledCourseAnalytics = async () => {
            try {
                const response = await axios.get('/api/courses/enrollments');
                setEnrollments(response.data.enrolledCourses || []);
                setTotalStudents(response.data.totalStudents);
            } catch (error) {
                console.error("Error fetching enrollments:", error);
                setCourses([]);
            }
        };

        getEnrolledCourseAnalytics().then();
    }, []);

    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <DataCard
                    value={totalStudents}
                    label="Загальна кількість студентів"
                    icon={GraduationCap}
                />
            </div>
            <Chart
                data={enrollments}
            />
            <DataCard
                value={totalAttempts}
                label="Статистика активності студентів"
                icon={School}
            />
            <CourseTable
                courses={courses}
            />
        </div>
    )
}

export default AnalyticsPage;