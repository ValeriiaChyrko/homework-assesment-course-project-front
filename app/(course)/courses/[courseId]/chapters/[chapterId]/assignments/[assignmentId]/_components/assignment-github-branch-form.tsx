"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Check, ChevronDown, X } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { useQueryClient } from "@tanstack/react-query";

interface GitHubBranchFormProps {
    initialData: {
        branchName?: string | null;
    };
    courseId: string;
    chapterId: string;
    assignmentId: string;
    attemptId: string;
    options: { label: string; value: string }[];
}

const formSchema = z.object({
    branchName: z.string().min(1, "Назва має містити принаймні один символ"),
});

export const GitHubBranchForm = ({
                                     initialData,
                                     courseId,
                                     chapterId,
                                     assignmentId,
                                     attemptId,
                                     options,
                                 }: GitHubBranchFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing((prev) => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            branchName: initialData.branchName || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(
                `/api/courses/${courseId}/chapters/${chapterId}/assignments/${assignmentId}/attempts/${attemptId}`,
                values
            );
            await queryClient.invalidateQueries({
                queryKey: ["attempts", courseId, chapterId, assignmentId],
            });
            toggleEditing();
            toast.success("Дані оновлено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "На жаль, щось пішло не так. Спробуйте ще раз."
            );
            console.error(error);
        }
    };

    const selectedOption = options.find(
        (option) => option.value === initialData?.branchName
    );

    return (
        <div className="rounded-md">
            <div className="font-medium flex items-center justify-between">
                {!isEditing && (
                    <div className={cn("text-sm", {
                        "text-slate-500 italic": !initialData.branchName,
                        "text-gray-700 pr-2": initialData.branchName,
                    })}>
                        <span>{initialData.branchName ? selectedOption?.label : "Гілку не обрано"}</span>
                    </div>
                )}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="branchName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-1">
                                                <Combobox
                                                    options={options}
                                                    value={field.value}
                                                    onChangeAction={field.onChange}
                                                    size="sm"
                                                />
                                                <Button
                                                    disabled={!isValid || isSubmitting}
                                                    variant="ghost"
                                                    type="submit"
                                                    className="px-1 ml-1"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                )}
                <Button onClick={toggleEditing} variant="ghost" className="px-1 mr-1">
                    {isEditing ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                {isSubmitting && <p className="text-sm text-gray-500 mt-1 px-4">Зачекайте, відправка даних...</p>}
            </div>
        </div>
    );
};