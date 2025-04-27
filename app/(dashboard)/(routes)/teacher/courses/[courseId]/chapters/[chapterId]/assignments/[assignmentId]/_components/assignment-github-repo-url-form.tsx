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
import {PencilIcon} from "lucide-react";
import {useCallback, useState} from "react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {useQueryClient} from "@tanstack/react-query";


interface AssignmentGitHubRepoTitleFormProps {
    initialData: {
        repositoryUrl: string;
        repositoryOwner: string;
        repositoryName: string;
        repositoryBaseBranchName: string;
    };
    courseId: string;
    chapterId: string;
    assignmentId: string;
}

const formSchema = z.object({
    repositoryUrl: z.string().trim()
        .min(1, {
            message: "Необхідно вказати URL GitHub репозиторія.",
        })
        .max(256, {
            message: "URL GitHub репозиторія не повинна перевищувати 256 символів."
        })
        .url({
            message: "Некоректний формат URL.",
        })
        .refine(url => /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/.test(url), {
            message: "URL має бути у форматі 'https://github.com/owner/repository'.git",
        }),
    repositoryBaseBranchName: z.string().trim()
        .min(1, {
            message: "Необхідно вказати базову гілку GitHub репозиторія.",
        })
});

export const AssignmentGithubRepoUrlForm= ({ initialData, courseId, chapterId, assignmentId }: AssignmentGitHubRepoTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            repositoryUrl: initialData.repositoryUrl || '',
            repositoryBaseBranchName: initialData.repositoryBaseBranchName || 'main',
        },
    });

    const { isSubmitting, isValid } = form.formState;

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

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                URL репозиторію (GitHub HTTPS)
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити URL завдання"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Змінити назву
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-md text-gray-700", {
                    "text-slate-500 italic": !initialData.repositoryUrl,
                    "text-slate-700": initialData.repositoryUrl
                })}>
                    {!initialData.repositoryUrl ? (
                        <span className="text-slate-500 italic">URL не вказано</span>
                    ) : (
                        <span>{initialData.repositoryUrl}</span>
                    )}
                    <div className="mt-2">
                        <span>Власник: </span>
                        {initialData.repositoryOwner ? (
                            <span className="font-semibold">{initialData.repositoryOwner}</span>
                        ) : (
                            <span className="text-slate-500 italic">Власника не вказано</span>
                        )}
                    </div>
                    <div>
                        <span>Назва: </span>
                        {initialData.repositoryName ? (
                            <span className="font-semibold">{initialData.repositoryName}</span>
                        ) : (
                            <span className="text-slate-500 italic">Назву не вказано</span>
                        )}
                    </div>
                    <div>
                        <span>Базова гілка: </span>
                        {initialData.repositoryBaseBranchName ? (
                            <span className="font-semibold">{initialData.repositoryBaseBranchName}</span>
                        ) : (
                            <span className="text-slate-500 italic">Базову гілку не вказано</span>
                        )}
                    </div>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField control={form.control} name="repositoryUrl" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                            disabled={isSubmitting}
                                            placeholder="Наприклад, 'https://github.com/<owner>/<repository>.git'"
                                            className="w-full p-3 rounded-lg border border-gray-400"
                                            aria-label="Поле введення URL завдання:Наприклад, 'https://github.com/<owner>/<repository>.git'"
                                            {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-pink-600" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="repositoryBaseBranchName" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        disabled={isSubmitting}
                                        placeholder="Наприклад, 'main'"
                                        className="w-full p-3 rounded-lg border border-gray-400"
                                        aria-label="Поле введення базової гілки:Наприклад, 'main'"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-pink-600" />
                            </FormItem>
                        )} />
                        <div className="flex items-center gap-x-4">
                            <Button
                                disabled={isSubmitting || !isValid}
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

export default AssignmentGithubRepoUrlForm;