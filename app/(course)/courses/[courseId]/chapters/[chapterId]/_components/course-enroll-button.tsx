"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import axios from "axios";
import {useQueryClient} from "@tanstack/react-query";

interface CourseEnrollButtonProps {
    courseId: string;
}

export const CourseEnrollButton = ({
    courseId
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.patch(`/api/courses/${courseId}/enroll`, courseId);
            await queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
            await queryClient.invalidateQueries({ queryKey: ["courseWithProgress", courseId] });

            toast.success("Ви успішно зареєструвались на курс.");
            router.refresh();
        } catch (e) {
            toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto"
        >
            Зареєструватися
        </Button>
    )
}