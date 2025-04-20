"use client";

import { SearchInput } from "@/components/search-input";
import { CoursesList } from "@/components/couses-list";
import { CoursesListSkeleton } from "@/components/course-list-skeleton";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ErrorPage } from "@/components/opps-page";
import { LayoutGridIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTheme } from "next-themes";
import { Categories } from "@/app/(dashboard)/(routes)/search/_components/categories";

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

export const SearchPageContent = () => {
    const searchParams = useSearchParams();
    const title = searchParams.get("title");
    const categoryId = searchParams.get("categoryId");

    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
    } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const {
        data: courses = [],
        isLoading: isCoursesLoading,
        isError: isCoursesError,
    } = useQuery<CourseWithProgressWithCategory[], Error>({
        queryKey: ["courses", title, categoryId],
        queryFn: () => fetchCourses(title, categoryId),
    });

    const userText = "В даний момент немає курсів, які б відповідали вашому запиту.";
    const { theme } = useTheme();

    if (isCategoriesError || isCoursesError) return <ErrorPage />;

    return (
        <>
            <div className="px-6 pt-6 flex flex-col md:!flex-row gap-4 w-full">
                <Sheet>
                    <SheetTrigger
                        disabled={isCategoriesLoading}
                        className="py-2 px-4 cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:opacity-75 flex-row bg-accent-light hover:text-accent-foreground hover:bg-primary/90"
                    >
                        <LayoutGridIcon className="h-4 w-4 mr-2" />
                        Категорії
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className={cn(
                            "p-0",
                            theme === "dark"
                                ? "bg-slate-900 border-gray-50 transition-colors duration-300 "
                                : "bg-white border-gray-900/25 "
                        )}
                    >
                        <SheetTitle>
                            <VisuallyHidden>Список категорій</VisuallyHidden>
                        </SheetTitle>
                        <div className="border-b border-dashed border-gray-900/25">
                            <h1 className="p-8 font-bold">Категорії</h1>
                        </div>
                        <Categories items={categories} />
                    </SheetContent>
                </Sheet>

                <div className="flex-grow">
                    <SearchInput />
                </div>
            </div>
            <div className="p-6 space-y-6">
                {isCoursesLoading ? (
                    <CoursesListSkeleton />
                ) : (
                    <CoursesList items={courses} userText={userText} showProgress={false} />
                )}
            </div>
        </>
    );
};