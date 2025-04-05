"use client";

import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";
import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/couses-list";
import { Skeleton } from "@/components/ui/skeleton";
import { CoursesListSkeleton } from "@/components/course-list-skeleton";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ErrorPage } from "@/components/opps-page";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number;
};

const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await axios.get('/api/categories');
    return data.categories;
};

const fetchCourses = async (title: string | null, categoryId: string | null): Promise<CourseWithProgressWithCategory[]> => {
    const { data } = await axios.get('/api/courses', { params: { title, categoryId } });
    return data.courses;
};

const SearchPage = () => {
    const searchParams = useSearchParams();
    const title = searchParams.get("title");
    const categoryId = searchParams.get("categoryId");

    const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const { data: courses = [], isLoading: isCoursesLoading, isError: isCoursesError } = useQuery<CourseWithProgressWithCategory[], Error>({
        queryKey: ["courses", title, categoryId],
        queryFn: () => fetchCourses(title, categoryId),
    });

    const userText = "В даний момент немає курсів, які б відповідали вашому запиту.";

    return (
        <>
            {(isCategoriesError || isCoursesError) ? (
                <ErrorPage />
            ) : (
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
                            <CoursesList items={courses} userText={userText} showProgress={false}/>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default SearchPage;