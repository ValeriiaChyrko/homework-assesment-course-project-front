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
import {useEffect, useState} from "react";
import axios from "axios";

const CourseIdPage = ({ params }: { params: Promise<{ courseId: string }> }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [course, setCourse] = useState<Course | null>(null);

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

        getCategories();
    }, []);

    useEffect(() => {
        const getCourse = async () => {
            const { courseId } = await params;
            if (!courseId) return;

            try {
                const response = await axios.get(`/api/courses/${courseId}`);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        getCourse();
    }, [params]);

    if (!course) return null;

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.categoryId,
        course.chapters.some((chapter: Chapter) => chapter.isPublished),
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
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Налаштування курсу</h1>
                        <span className="text-sm text-slate-700">
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
                            options={categories.map((category: Category) => ({
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