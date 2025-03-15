"use client";

import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/couses-list";
import { useEffect, useState } from "react";
import axios from "axios";

interface SearchPageProps {
    searchParams: {
        title?: string;
        categoryId?: string;
    };
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
    const [categories, setCategories] = useState<Category[] | []>([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategories([]);
            }
        };

        getCategories().then();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const getCourses = async () => {
            try {
                const response = await axios.get('/api/courses', {
                    params: {
                        title: searchParams.title,
                        categoryId: searchParams.categoryId,
                        Include: ['category', 'progress'],
                        IsPublished: 'true'
                    },
                    signal
                });
                setCourses(response.data.courses || []);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error fetching courses:", error);
                    setCourses([]);
                }
            }
        };

        getCourses();

        return () => controller.abort();
    }, [searchParams]);

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-6">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    );
};

export default SearchPage;