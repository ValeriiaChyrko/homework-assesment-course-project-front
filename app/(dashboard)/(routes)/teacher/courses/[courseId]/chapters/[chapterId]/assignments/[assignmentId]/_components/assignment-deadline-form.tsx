"use client";

import * as React from "react";
import { uk } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {useCallback, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";

interface AssignmentDeadlineFormProps {
    initialData: {
        deadline: Date;
    };
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const formSchema = z.object({
    deadline: z.date().optional()
});

export const AssignmentDeadlineForm = ({ initialData, courseId, chapterId, assignmentId }: AssignmentDeadlineFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date(initialData.deadline.toString()));

    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            deadline: date,
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const [error, setError] = useState<string | ''>('');

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            if (selectedDate <= new Date()) {
                setError("Дата повинна бути після сьогоднішньої.")
            } else {
                form.setValue("deadline", selectedDate);
                setError('');
            }
        } else {
            form.setValue("deadline", undefined);
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}`, values);
            await queryClient.invalidateQueries({ queryKey: ["assignment", courseId, chapterId, assignmentId] });
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
                Граничний термін здачі
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити граничний термін здачі"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Змінити термін
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-md text-gray-700">
                    {date ? format(date, "PPP", { locale: uk }) : "Дата не вказана"}
                </p>
            )}
            {isEditing && (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    aria-label="Вибрати дату"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP", { locale: uk }) : <span>Оберіть дату</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateChange}
                                    locale={uk}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {error && (
                        <p className="text-sm text-pink-600">{error}</p>
                    )}
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
            )}
        </div>
    );
};

export default AssignmentDeadlineForm;