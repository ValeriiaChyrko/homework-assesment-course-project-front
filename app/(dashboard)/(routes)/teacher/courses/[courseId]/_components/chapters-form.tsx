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
import {cn} from "@/lib/utils";
import {ChaptersList} from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/chapters-list";
import {useQueryClient} from "@tanstack/react-query";
import {useRouter} from "next/navigation";

interface ChaptersFormProps {
    initialData: {
        title: string;
        chapters: Chapter[] | null;
    };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().trim().min(1, {
        message: "Необхідно вказати назву розділу.",
    }),
});

export const ChaptersForm  = ({ initialData, courseId }: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();

    const toggleCreating = () => setIsCreating((current) => !current);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            await queryClient.invalidateQueries({ queryKey: ["course", courseId] });
            toggleCreating();
            toast.success("Секцію створено успішно.");
            form.reset(values);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        }
    };

    const onReorder = async (updatedData: { id: string; position: number }[]) => {
        try{
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: updatedData});
            await queryClient.invalidateQueries({ queryKey: ["course", courseId] });

            toast.success("Порядок розділів змінено успішно.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "На жаль, щось пішло не так. Спробуйте ще раз.");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 relative">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-sky-700"/>
                </div>
            )}
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Розділи курсу
                <Button
                    onClick={toggleCreating}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isCreating ? "Скасувати створення нового розділу" : "Додати новий розділ курсу"}
                >
                    {isCreating ? "Скасувати" : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Додати новий розділ
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
                                        placeholder="Наприклад, 'Інформація про курс'"
                                        className="w-full p-3 rounded-lg border border-gray-400 focus:ring-2"
                                        aria-label="Поле введення назви: Наприклад, 'Просунутий C# та обробка даних у .NET'"
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
                    !initialData.chapters?.length && "italic"
                )}>
                    {!initialData.chapters?.length && "Ще не додано жодних розділів."}
                    <ChaptersList
                        onEditAction={onEdit}
                        onReorderAction={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <div className="text-sm text-muted-foreground mt-4">
                    Перетягніть і відпустіть, щоб змінити порядок розділів
                </div>
            )}
        </div>
    )
}

export default ChaptersForm;