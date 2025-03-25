"use client";

import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/couses-list";
import { Skeleton } from "@/components/ui/skeleton";
import { CoursesListSkeleton } from "@/components/course-list-skeleton";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number | null;
};

const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get('/api/categories');
    return response.data.categories;
};

const fetchCourses = async (title: string | null, categoryId: string | null): Promise<CourseWithProgressWithCategory[]> => {
    const response = await axios.get('/api/courses', {
        params: {
            title,
            categoryId,
        },
    });
    return response.data.courses;
};

const SearchPage = () => {
    const searchParams = useSearchParams();
    const title = searchParams.get("title");
    const categoryId = searchParams.get("categoryId");

    const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const { data: coursesData, isLoading: isCoursesLoading, isError: isCoursesError } = useQuery<CourseWithProgressWithCategory[], Error>({
        queryKey: ["courses", title, categoryId],
        queryFn: () => fetchCourses(title, categoryId),
    });

    const categories = categoriesData  || [];
    const courses:CourseWithProgressWithCategory[] = coursesData || [];
    const userText = "В даний момент немає курсів, які б відповідали вашому запиту.";

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-6">
                {isCategoriesLoading ? (
                    <Skeleton className="w-full h-full" />
                ) : isCategoriesError ? (
                    <p>Error fetching categories.</p>
                ) : (
                    <Categories items={categories} />
                )}

                {isCoursesLoading ? (
                    <CoursesListSkeleton />
                ) : isCoursesError ? (
                    <p>Error fetching courses.</p>
                ) : (
                    <CoursesList items={courses}  userText={userText} />
                )}
            </div>
        </>
    );
};

export default SearchPage;