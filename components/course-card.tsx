import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {IconBadge} from "@/components/icon-badge";
import {BookOpen} from "lucide-react";

interface CourseCardProps {
    category: string;
    course: Course;
    chaptersLength: number;
    progress: number | null;
    displayProgress: boolean;
}

export const CourseCard = ({
                               course,
                               chaptersLength,
                               progress,
                               category,
                               displayProgress,
                           }: CourseCardProps) => {
    let chapterText;
    if (chaptersLength % 10 === 1 && chaptersLength % 100 !== 11) {
        chapterText = "Розділ";
    } else if (chaptersLength % 10 >= 2 && chaptersLength % 10 <= 4 && (chaptersLength % 100 < 10 || chaptersLength % 100 >= 20)) {
        chapterText = "Розділи";
    } else {
        chapterText = "Розділів";
    }

    const buttonText = progress === 0 ? "Розпочати вивчення" : progress === 100 ? "Переглянути курс" : "Продовжити вивчення";

    return (
        <Card className="group hover:shadow-lg transition overflow-hidden border border-gray-900/25 rounded-lg">
            <div className="relative w-full h-48">
                <Image
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    fill={true}
                    className="object-cover"
                    priority
                />
                <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground pb-1 border-2 border-primary">{category}</Badge>
            </div>
            <CardHeader className="mt-2">
                <div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
                    <div className="mt-4 flex items-center gap-x-2">
                        <IconBadge size="sm" icon={BookOpen} />
                        <h4 className="text-sm">{chaptersLength} {chapterText}</h4>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                {displayProgress && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium">Прогрес</span>
                            <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div
                                role="progressbar"
                                aria-valuenow={progress ?? 0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Прогрес"
                                className="relative w-full overflow-hidden rounded-full h-2 bg-emerald-100"
                            >
                                <div
                                    style={{ width: `${progress ?? 0}%` }}
                                    className="bg-emerald-500 h-full"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-2">
                <Link href={`/courses/${course.id}`} className="block w-full">
                    <button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md text-sm font-medium transition-colors"
                        aria-label={buttonText}
                    >
                        {buttonText}
                    </button>
                </Link>
            </CardFooter>
        </Card>
    );
};