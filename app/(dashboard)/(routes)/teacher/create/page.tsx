"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Необхідно вказати назву",
    }),
});

const CreatePage = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.course.id}`);
            toast.success("Курс створено успішно.");
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen max-w-5xl mx-auto mt-[-80px] flex items-center justify-center">
            <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-3">
                    Введіть назву курсу
                </h1>
                <p className="text-sm text-gray-600 mb-7">
                    Як би ви хотіли назвати свій курс? Не хвилюйтеся, ви зможете змінити назву пізніше.
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-9 mt-9"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem key="title">
                                    <FormLabel className="text-gray-700 font-medium">Назва курсу</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Наприклад, 'Просунутий C# у .NET'"
                                            aria-label="Поле для введення назви"
                                            className={`mt-3 pl-4 rounded-lg bg-slate-50 border border-gray-200 text-slate-800 transition-all`}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-gray-500">
                                        Вкажіть тематику курсу, щоб студенти розуміли його зміст.
                                    </FormDescription>
                                    <FormMessage className="text-pink-600" />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-3">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    aria-label="Скасувати створення нового курсу"
                                >
                                    Скасувати
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                aria-label="Продовжити створення нового курсу"
                            >
                                Продовжити
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;