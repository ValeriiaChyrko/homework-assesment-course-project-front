"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useMemo } from "react";
import toast from "react-hot-toast";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ErrorPage } from "@/components/opps-page";

const formSchema = z.object({
    courseId: z.string().min(1, "Оберіть курс"),
    chapterId: z.string().min(1, "Оберіть розділ"),
    assignmentId: z.string().min(1, "Оберіть завдання"),
});

interface AnalyticsFormProps {
    courses: {
        courseId: string;
        courseTitle: string;
    }[];
    onSubmitAction: (values: {
        courseId: string;
        chapterId: string;
        assignmentId: string;
    }) => void;
}

const fetchChapters = async (courseId: string): Promise<Chapter[]> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters`);
    return response.data.chapters;
};

const fetchAssignments = async (courseId: string, chapterId: string): Promise<Assignment[]> => {
    const response = await axios.get(`/api/courses/${courseId}/chapters/${chapterId}/assignments`);
    return response.data.assignments;
};

export const AnalyticsForm = ({ courses, onSubmitAction }: AnalyticsFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            courseId: "",
            chapterId: "",
            assignmentId: "",
        },
    });

    const courseId = form.watch("courseId");
    const chapterId = form.watch("chapterId");

    const courseOptions = useMemo(
        () => courses.map((item) => ({ label: item.courseTitle, value: item.courseId })),
        [courses]
    );

    const {
        data: chapters = [],
        error: chaptersError,
        isLoading: isChaptersLoading,
    } = useQuery<Chapter[]>({
        queryKey: ["fetchChapters", courseId],
        queryFn: () => fetchChapters(courseId),
        enabled: !!courseId,
    });

    const chapterOptions = useMemo(
        () => chapters.map((item) => ({ label: item.title, value: item.id })),
        [chapters]
    );

    const {
        data: assignments = [],
        error: assignmentsError,
        isLoading: isAssignmentsLoading,
    } = useQuery<Assignment[]>({
        queryKey: ["assignments", courseId, chapterId],
        queryFn: () => fetchAssignments(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    });

    const assignmentOptions = useMemo(
        () => assignments.map((item) => ({ label: item.title, value: item.id })),
        [assignments]
    );

    const hasError = chaptersError || assignmentsError;
    if (hasError) return <ErrorPage />;

    const {
        formState: { isSubmitting, isValid },
    } = form;

    const onLocalSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onSubmitAction(values);
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    };


    return (
        <div className="rounded-lg shadow-lg border bg-slate-50 border-gray-200 px-6 py-4">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onLocalSubmit)}
                    className="mt-4 space-y-4"
                >
                    <div>
                        <div className="font-semibold text-md mb-1">Назва курсу</div>
                        <FormField
                            control={form.control}
                            name="courseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            size="sm"
                                            options={courseOptions}
                                            value={field.value}
                                            onChangeAction={(value) => {
                                                field.onChange(value);
                                                form.setValue("chapterId", "");
                                                form.setValue("assignmentId", "");
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-pink-600" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {courseId && (
                        <div>
                            <div className="font-semibold text-md mb-1">Назва розділу</div>
                            <FormField
                                control={form.control}
                                name="chapterId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {isChaptersLoading ? (
                                                <div className="animate-pulse bg-gray-200 rounded-md h-10 w-full" />
                                            ) : (
                                                <Combobox
                                                    size="sm"
                                                    options={chapterOptions}
                                                    value={field.value}
                                                    onChangeAction={(value) => {
                                                        field.onChange(value);
                                                        form.setValue("assignmentId", "");
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-pink-600" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {chapterId && (
                        <div>
                            <div className="font-semibold text-md mb-1">Назва завдання</div>
                            <FormField
                                control={form.control}
                                name="assignmentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            {isAssignmentsLoading ? (
                                                <div className="animate-pulse bg-gray-200 rounded-md h-10 w-full" />
                                            ) : (
                                                <Combobox
                                                    size="sm"
                                                    options={assignmentOptions}
                                                    value={field.value}
                                                    onChangeAction={field.onChange}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage className="text-pink-600" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <div className="mt-6">
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            className="w-full transition-colors rounded-lg"
                        >
                            Показати результати
                        </Button>
                    </div>

                    {isSubmitting && (
                        <p className="text-sm text-gray-500">
                            Зачекайте, отримання даних...
                        </p>
                    )}
                </form>
            </Form>
        </div>
    );
};

export default AnalyticsForm;