"use client";

import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/couses-list";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { CoursesListSkeleton } from "@/components/course-list-skeleton";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const title = searchParams.get("title");
    const categoryId = searchParams.get("categoryId");

    const [categories, setCategories] = useState<Category[] | []>([]);
    const [courses, setCourses] = useState([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [isCoursesLoading, setIsCoursesLoading] = useState(true);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Не вдалося завантажити категорії. Спробуйте ще раз.");
                setCategories([]);
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        getCategories();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const getCourses = async () => {
            try {
                const response = await axios.get('/api/courses', {
                    params: {
                        title,
                        categoryId,
                    },
                    signal
                });
                setCourses(response.data.courses || []);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error fetching courses:", error);
                    toast.error("Не вдалося завантажити курси. Спробуйте ще раз.");
                    setCourses([]);
                }
            } finally {
                setIsCoursesLoading(false);
            }
        };

        getCourses();

        return () => controller.abort();
    }, [title, categoryId]);

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-6">
                {isCategoriesLoading ? (
                    <Skeleton className="w-full h-full" />
                ) : (
                    <Categories items={categories} />
                )}

                {isCoursesLoading ? (
                    <CoursesListSkeleton />
                ) : (
                    <CoursesList items={courses} displayProgress={false} />
                )}
            </div>
        </>
    );
};

export default SearchPage;