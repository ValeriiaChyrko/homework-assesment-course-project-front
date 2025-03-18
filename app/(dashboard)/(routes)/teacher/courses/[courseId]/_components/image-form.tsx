"use client"

import * as z from "zod";
import axios from "axios";

import {Button} from "@/components/ui/button";
import {ImageIcon, PencilIcon, PlusCircle} from "lucide-react";
import {useCallback, useState} from "react";
import toast from "react-hot-toast";
import Image from "next/image"
import {FileUpload} from "@/components/file-upload";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

interface ImageFormProps {
    initialData: {
        imageUrl?: string;
    };
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().trim().min(1, {
        message: "Необхідно прикріпити зображення.",
    }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEditing = useCallback(() => setIsEditing(prev => !prev), []);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: initialData.imageUrl || '',
        },
    });

    const { isSubmitting } = form.formState;

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

    return(
        <div className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="font-semibold text-lg flex items-center justify-between mb-4">
                Обкладинка курсу
                <Button
                    onClick={toggleEditing}
                    variant="ghost"
                    className="flex items-center transition-colors"
                    aria-label={isEditing ? "Скасувати редагування" : "Прикріпити зображення"}
                >
                    {isEditing ? "Скасувати" : !isEditing && !initialData.imageUrl ? (
                        <>
                            <PlusCircle className="h-4 w-4 mr-1"/>
                            Прикріпити забраження
                        </>
                    ) : (
                        <>
                            <PencilIcon className="h-4 w-4 mr-1"/>
                            Змінити забраження
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200/50 rounded-md mt-4">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-4">
                        <Image
                            src={initialData.imageUrl}
                            alt="Course Image"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-md"
                            aria-label="Зображення курсу"
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChangeAction={(url?: string) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-sm text-muted-foreground mt-4">
                        Рекомендується співвідношення сторін 16:9
                    </div>
                    {isSubmitting && <p className="text-sm text-gray-500">Зачекайте, відправка даних...</p>}
                </div>
            )}
        </div>
    )
}

export default ImageForm;