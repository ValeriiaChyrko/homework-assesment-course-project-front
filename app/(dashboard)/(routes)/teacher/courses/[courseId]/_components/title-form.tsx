"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().trim()
        .min(1, {
            message: "Необхідно вказати назву.",
        })
        .max(64, {
            message: "Назва курсу не повинна перевищувати 64 символи."
        }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData.title || '',
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
                <span>Назва курсу</span>
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити назву курсу"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Змінити назву
                        </>
                    )}
                </Button>
            </div>

            {!isEditing ? (
                <p className="text-md text-gray-700">{initialData.title}</p>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="Наприклад, 'Просунутий C# та обробка даних у .NET'"
                                        className="w-full p-3 rounded-lg border border-gray-400 focus:ring-2"
                                        aria-label="Поле введення назви: Наприклад, 'Просунутий C# та обробка даних у .NET'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-pink-600" />
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-4">
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

export default TitleForm;