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

import {Button} from "@/components/ui/button";
import {PencilIcon} from "lucide-react";
import {useCallback, useState} from "react";
import toast from "react-hot-toast";
import {cn} from "@/lib/utils";
import {Combobox} from "@/components/ui/combobox";
import {useQueryClient} from "@tanstack/react-query";

interface CategoryFormProps {
    initialData: {
        categoryId?: string | null;
    };
    courseId: string;
    options: { label: string; value: string } [];
}

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId || '',
        },
    });

    const {isSubmitting, isValid} = form.formState;

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

    const selectedOption = options.find((option) => option.value === initialData.categoryId);

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Категорія
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Змінити категорію"}
                >
                    {isEditing ? "Скасувати" : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Змінити категорію
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={cn(
                    "text-md text-gray-700 mt-2",
                    !initialData.categoryId && "italic"
                )}>
                    {selectedOption?.label || "Без категорії"}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                        <Combobox
                                            options={options}
                                            value={field.value}
                                            onChangeAction={field.onChange}
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

export default CategoryForm;