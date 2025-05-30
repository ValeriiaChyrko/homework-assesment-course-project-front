﻿"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"

import {Button} from "@/components/ui/button";
import {PencilIcon} from "lucide-react";
import {useCallback, useState} from "react";
import toast from "react-hot-toast";
import {Editor} from "@/components/editor/editor";
import {Preview} from "@/components/editor/preview";
import {useQueryClient} from "@tanstack/react-query";
import {Toolbar} from "@/components/editor/toolbar";
import { cn } from "@/lib/utils";

interface ChapterDescriptionFormProps {
    initialData: {
        description?: string;
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    description: z.string().trim()
        .min(1, {
            message: "Необхідно вказати опис розділу.",
        })
        .max(10000, {
            message: "Опис розділу курсу не повинен перевищувати 10 000 символів."
        }),
});

export const DescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData.description || '',
        },
    });

    const { isSubmitting, isValid, errors  } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            await queryClient.invalidateQueries({ queryKey: ["chapter", courseId, chapterId] });
            toggleEditing();
            toast.success("Дані оновлено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    };

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Опис розділу
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити опис розділу"}
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
                <div className={cn("text-md text-gray-700 mt-2", !initialData.description && "italic")}>
                    {!initialData.description && "Без опису"}
                    {initialData.description && (
                        <Preview
                            value={initialData.description}
                        />
                    )}
                </div>
            ) :  (
                <>
                    <div className="scale-90">
                        <Toolbar/>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor
                                            onChangeAction={function (value: string): void {
                                                form.setValue("description", value);
                                                form.trigger("description");
                                            }}
                                            {...field}
                                        />
                                    </FormControl>
                                    {errors.description && <p className="text-pink-600">{errors.description.message}</p>}
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
                </>
            )}
        </div>
    );
};

export default DescriptionForm;