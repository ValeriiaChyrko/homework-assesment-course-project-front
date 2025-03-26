"use client";

import { DataTable } from "@/app/(dashboard)/(routes)/teacher/courses/_components/data-table";
import { DataTableSkeleton } from "@/app/(dashboard)/(routes)/teacher/courses/_components/data-table-skeleton";
import { columns } from "./_components/columns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {ErrorPage} from "@/components/opps-page";

const fetchCourses = async () => {
    const response = await axios.get("/api/courses/owned");
    return response.data.courses || [];
};

const CoursesPage = () => {
    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ["courses"],
        queryFn: fetchCourses,
    });

    if (isLoading) {
        return (
            <div className="px-6">
                <div className="container mx-auto py-6 w-full">
                    <DataTableSkeleton />
                </div>
            </div>
        );
    }

    if (isError) {
        return <ErrorPage/>;
    }

    return (
        <div className="px-6">
            <div className="container mx-auto py-6 w-full">
                <DataTable columns={columns} data={courses} />
            </div>
        </div>
    );
};

export default CoursesPage;