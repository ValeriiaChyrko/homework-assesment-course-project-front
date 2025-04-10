import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { CourseProgress } from "@/components/course-progress";

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
    let chapterText;
    if (chaptersLength % 10 === 1 && chaptersLength % 100 !== 11) {
        chapterText = "Розділ";
    } else if (
        chaptersLength % 10 >= 2 &&
        chaptersLength % 10 <= 4 &&
        (chaptersLength % 100 < 10 || chaptersLength % 100 >= 20)
    ) {
        chapterText = "Розділи";
    } else {
        chapterText = "Розділів";
    }

    const buttonText =
        progress === 0
            ? "Розпочати вивчення"
            : progress === 100
                ? "Переглянути курс"
                : "Продовжити вивчення";

    return (
        <Card className="group hover:shadow-lg transition overflow-hidden border border-gray-900/25 rounded-lg relative">
            {/* ЗОБРАЖЕННЯ */}
            <div className="relative w-full h-48">
                <Image
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute right-3 -bottom-1/8 bg-accent text-primary p-4 rounded-lg inline-flex items-center justify-center text-xs font-semibold text-center break-words">
                    {category}
                </div>
                {/* ВИЇЖДЖАЮЧИЙ БЕЙДЖ */}
                <div
                    className="absolute top-1/8
                           translate-x-[-10px] opacity-0
                           group-hover:translate-x-0 group-hover:opacity-100
                           transition-all duration-300 z-10"
                >
                    <div className="bg-accent-dark text-[14px] px-4 py-2 rounded-tr-md rounded-br-md font-bold tracking-wide shadow-md">
                        {chaptersLength} {chapterText}
                    </div>
                </div>
            </div>

            {/* ВМІСТ */}
            <CardHeader className="mt-2">
                <div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                {showProgress && progress > 0 && (
                    <div className="mt-6">
                        <CourseProgress variant="success" value={progress} />
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-2">
                <Link href={`/courses/${course.id}`} className="block w-full">
                    <button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-accent-foreground py-2 rounded-md text-sm font-medium transition-colors"
                        aria-label={buttonText}
                    >
                        {buttonText}
                    </button>
                </Link>
            </CardFooter>
        </Card>
    );
};