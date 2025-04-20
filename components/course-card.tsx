import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CourseProgress } from "@/components/course-progress";
import {AlignLeftIcon} from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";

interface CourseCardProps {
    category: string;
    course: Course;
    chaptersLength: number;
    progress: number;
    showProgress?: boolean;
}

export const CourseCard = ({
                               course,
                               chaptersLength,
                               progress,
                               showProgress,
                               category,
                           }: CourseCardProps) => {
    const buttonText =
        progress === 0
            ? "Розпочати вивчення"
            : progress === 100
                ? "Переглянути курс"
                : "Продовжити вивчення";

    const chapterText = (() => {
        if (chaptersLength % 10 === 1 && chaptersLength % 100 !== 11) return "Розділ";
        if (
            chaptersLength % 10 >= 2 &&
            chaptersLength % 10 <= 4 &&
            (chaptersLength % 100 < 10 || chaptersLength % 100 >= 20)
        ) return "Розділи";
        return "Розділів";
    })();

    return (
        <Card className="flex flex-col  md:!flex-row overflow-hidden rounded-3xl shadow-lg border border-gray-200">
            {/* LEFT: Image, badge, and button */}
            <div className="relative md:w-1/3 min-w-[250px] flex flex-col justify-between p-6">
                <div className="relative w-full aspect-video">
                    <Image
                        src={course.imageUrl || "/placeholder.svg"}
                        alt={course.title}
                        fill
                        className="object-cover rounded-3xl"
                        priority
                    />

                    {/* Category badge */}
                    <div className="absolute -bottom-3 -right-3 px-2 py-1 bg-accent text-primary-foreground text-sm font-semibold rounded-3xl shadow-md">
                        {category}
                    </div>
                </div>

                {/* Course action */}
                <div className="p-2 mt-6">
                    <Link href={`/courses/${course.id}`}>
                        <Button
                            className="w-full"
                        >
                            {buttonText}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* RIGHT: Content */}
            <div className="flex flex-col justify-between p-6 pb-2 md:w-2/3">
                {/* Course info */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4 text-justify">
                        {course.description}
                    </p>
                    <p className="text-sm flex items-center gap-1 text-gray-600 mb-2">
                        <AlignLeftIcon className="h-4 w-4" />
                        {chaptersLength} {chapterText}
                    </p>
                </div>

                {/* Student progress */}
                {showProgress && progress > 0 && (
                    <div className="mt-6 mb-2">
                        <CourseProgress variant="success" value={progress} />
                    </div>
                )}
            </div>
        </Card>
    );
};
