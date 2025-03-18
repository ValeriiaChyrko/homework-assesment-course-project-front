"use client";

import { LayoutDashboard, ListChecks, File } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/title-form";
import DescriptionForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/description-form";
import ImageForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form";
import CategoryForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/category-form";
import AttachmentForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/attachment-form";
import ChaptersForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/actions";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
    EditCourseSkeleton
} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/edit-course-skeleton";

const fetchCourse = async (courseId: string): Promise<Course> => {
    const response = await axios.get(`/api/courses/${courseId}`);
    return response.data;
};

const fetchCategories = async (): Promise<Category[]> => {
    const response = await axios.get("/api/categories");
    return response.data.categories || [];
};

const CourseIdPage = ({ params }: { params: Promise<{ courseId: string }> }) => {
    const courseId = React.use(params).courseId;

    const { data: course, error: courseError, isLoading: isLoadingCourse } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => fetchCourse(courseId),
        enabled: !!courseId,
    });

    const { data: categories = [], error: categoriesError, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    if (isLoadingCourse || isLoadingCategories) return <EditCourseSkeleton/>;
    if (courseError) return <p>Error loading course: {courseError.message}</p>;
    if (categoriesError) return <p>Error loading categories: {categoriesError.message}</p>;
    if (!course) return null;

    const requiredFields = [
        !!course.title,
        !!course.description,
        !!course.imageUrl,
        !!course.categoryId,
        course.chapters?.length > 0 && course.chapters.some((chapter: Chapter) => chapter.isPublished),
    ];

    const completedFields = requiredFields.filter(Boolean).length;
    const totalFields = requiredFields.length;
    const isComplete = completedFields === totalFields;

    return (
        <>
            {!course.isPublished && (
                <Banner
                    variant="warning"
                    label="Цей курс ще не опублікований. Він не буде відображатися для студентів."
                />
            )}
            <div className="p-6">
                <div className="flex flex-col sm:!flex-row items-start md:items-center justify-between gap-y-4 space-x-2">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-3xl font-medium">Налаштування курсу</h1>
                        <span className="text-md text-slate-700">
                            Завершіть заповнення всіх полів ({completedFields}/{totalFields})
                        </span>
                    </div>
                    <Actions
                        disabled={!isComplete}
                        courseId={course.id}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Персоналізуйте свій курс</h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm initialData={course} courseId={course.id} />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">Тематичне наповнення курсу</h2>
                            </div>
                            <ChaptersForm initialData={course} courseId={course.id} />
                        </div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">Вкладення та супровідні файли</h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseIdPage;