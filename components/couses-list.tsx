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
            <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4">
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