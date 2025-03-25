"use client"

import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import axios from "axios";
import {ArrowLeftFromLine} from "lucide-react";
import {useQueryClient} from "@tanstack/react-query";

interface CourseEnrollButtonProps {
    courseId: string;
}

export const CourseWithdrawButton = ({
    courseId
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.patch(`/api/courses/${courseId}/withdraw`, courseId);

            await queryClient.invalidateQueries({ queryKey: ["enrollment", courseId] });
            await queryClient.invalidateQueries({ queryKey: ["courseWithProgress", courseId] });
            await queryClient.invalidateQueries({ queryKey: ["userProgress"] });
            await queryClient.invalidateQueries({ queryKey: ["chapter"] });

            toast.success("Ви успішно залишили курс.");
            router.push(`/`);
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
            variant="ghost"
            className="w-full md:w-auto text-slate-700"
        >
            Анулювати реєстрацію на курс
            <ArrowLeftFromLine className="h-6 w-6 ml-2 flx-shrink-0"/>
        </Button>
    )
}