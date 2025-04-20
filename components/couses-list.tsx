import {CourseCard} from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
    userText: string;
    showProgress?: boolean;
}

export const CoursesList = ({
    items,
    userText,
    showProgress
}: CoursesListProps) => {
    return (
        <div>
            <div className="flex flex-col gap-y-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        course={item}
                        chaptersLength={item.chapters.length}
                        progress={item.progress}
                        category={item?.category?.name || "Без категорії"}
                        showProgress={showProgress}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    {userText}
                </div>
            )}
        </div>
    )
}