"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {useQueryClient} from "@tanstack/react-query";

interface DescriptionFormProps {
    initialData: {
        description?: string;
    };
    courseId: string;
}

const formSchema = z.object({
    description: z.string().trim()
        .min(1, {
            message: "Необхідно вказати опис курсу.",
        })
        .max(512, {
            message: "Опис курсу не повинен перевищувати 512 символів."
        }),
});

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData.description || '',
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            await queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            toggleEditing();
            toast.success("Дані оновлено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    };

    return (
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                <span>Опис курсу</span>
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити опис курсу"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Змінити опис
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                <p className="text-md text-gray-700">{initialData.description || "Без опису"}</p>
            ) :  (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        disabled={isSubmitting}
                                        placeholder="Наприклад, 'Цей курс орієнтований на...'"
                                        className="w-full p-3 rounded-lg border border-gray-400 focus:ring-2"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-pink-600" />
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                className="w-full transition-colors rounded-lg"
                                aria-label="Зберегти зміни"
                            >
                                Зберегти зміни
                            </Button>
                        </div>
                        {isSubmitting && <p className="text-sm text-gray-500">Зачекайте, відправка даних...</p>}
                    </form>
                </Form>
            )}
        </div>
    );
};

export default DescriptionForm;