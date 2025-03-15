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

interface AssignmentsFormProps {
    initialData: Chapter & { assignments: Assignment[] };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const AssignmentForm = ({
    initialData,
    courseId,
    chapterId
}: AssignmentsFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCreating = () => setIsCreating((current) => !current);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        }
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/assignments`, values);
            toast.success("Завдання створено успішно.");
            toggleCreating();
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    }

    const onReorder = async (updatedData: { id: string; position: number }[]) => {
        try{
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/assignments/reorder`, {
                list: updatedData
            });

            toast.success("Порядок завдань змінено успішно.");
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/assignments/${id}`);
    }

    return(
        <div className="relative mt-6 border border-gray-900/25 bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Завдання курсу
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Скасувати</>
                    ) : (
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
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Наприклад, 'Практичне завдання №1'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Створити
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-4",
                    !initialData.assignments.length && "text-slate-500 italic"
                )}>
                    {!initialData.assignments.length && "Ще не додано жодних завдань"}
                    <AssignmentList
                        onEditAction={onEdit}
                        onReorderAction={onReorder}
                        items={initialData.assignments || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Перетягніть і відпустіть, щоб змінити порядок завдань.
                </p>
            )}
        </div>
    )
}

export default AssignmentForm;