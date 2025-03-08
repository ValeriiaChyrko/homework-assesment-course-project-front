"use client";

import { DataTable } from "@/app/(dashboard)/(routes)/teacher/courses/_components/data-table";
import { columns } from "./_components/columns";
import {useEffect, useState} from "react";
import axios from "axios";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const getCoursesWithProgressAndCategory = async () => {
            try {
                const response = await axios.get('/api/courses/owned');
                setCourses(response.data.courses || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };

        getCoursesWithProgressAndCategory().then();
    }, []);

    return (
        <div className="p-6">
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={courses} />
            </div>
        </div>
    );
};

export default CoursesPage;