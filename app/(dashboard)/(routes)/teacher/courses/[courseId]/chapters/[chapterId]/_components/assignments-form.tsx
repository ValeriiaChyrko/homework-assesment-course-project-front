"use client"

import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2, PlusCircle} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import { AssignmentList } from "./assignment-list";
import {useQueryClient} from "@tanstack/react-query";

interface AssignmentsFormProps {
    initialData: {
        title: string;
        assignments: Assignment[];
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().trim().min(1, {
        message: "Необхідно вказати назву завдання.",
    }),
});

export const AssignmentForm= ({ initialData, courseId, chapterId }: AssignmentsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    const toggleCreating = () => setIsCreating((current) => !current);
    const queryClient = useQueryClient();


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/assignments`, values);
            await queryClient.invalidateQueries({ queryKey: ["chapter", courseId, chapterId] });
            toggleCreating();
            toast.success("Завдання створено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    };

    const onReorder = async (updatedData: { id: string; position: number }[]) => {
        try{
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/assignments/reorder`, {
                list: updatedData
            });
            await queryClient.invalidateQueries({ queryKey: ["chapter", courseId, chapterId] });

            toast.success("Порядок завдань змінено успішно.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/assignments/${id}`);
    }

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 relative">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-sky-700"/>
                </div>
            )}
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Завдання курсу
                <Button
                    onClick={toggleCreating}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isCreating ? "Скасувати створення нового завдання" : "Додати нове завдання до розділу курсу"}
                >
                    {isCreating ? "Скасувати" : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Додати нове завдання
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="Наприклад, 'Практичне завдання №1'"
                                        className="w-full p-3 rounded-lg border border-gray-400 focus:ring-2"
                                        aria-label="Поле введення назви: Наприклад, 'Практичне завдання №1'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-pink-600" />
                            </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-4">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                className="w-full transition-colors rounded-lg"
                                aria-label="Зберегти зміни"
                            >
                                Створити
                            </Button>
                        </div>
                        {isSubmitting && <p className="text-sm text-gray-500">Зачекайте, відправка даних...</p>}
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-md text-gray-700 mt-2",
                    !initialData.assignments.length && "italic"
                )}>
                    {!initialData.assignments.length && "Ще не додано жодних завдань."}
                    <AssignmentList
                        onEditAction={onEdit}
                        onReorderAction={onReorder}
                        items={initialData.assignments || []}
                    />
                </div>
            )}
            {!isCreating && (
                <div className="text-sm text-muted-foreground mt-4">
                    Перетягніть і відпустіть, щоб змінити порядок завдань.
                </div>
            )}
        </div>
    )
}

export default AssignmentForm;