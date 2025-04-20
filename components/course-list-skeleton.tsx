import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CoursesListSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            {new Array(6).fill(null).map((_, i) => (
                <Card key={i} className="flex flex-col md:!flex-row overflow-hidden rounded-3xl shadow-lg border border-gray-200">
                    {/* LEFT: Image & badge placeholder */}
                    <div className="relative md:w-1/3 min-w-[250px] flex flex-col justify-between p-6">
                        <div className="relative w-full aspect-video">
                            <Skeleton className="w-full h-full rounded-3xl" />
                            <div className="absolute -bottom-3 -right-3 h-6 w-20 rounded-3xl bg-gray-100" />
                        </div>

                        <div className="p-2 mt-6">
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>

                    {/* RIGHT: Text & progress placeholders */}
                    <div className="flex flex-col justify-between p-6 pb-2 md:w-2/3">
                        <div>
                            <Skeleton className="h-6 w-1/2 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-11/12 mb-2" />
                            <Skeleton className="h-4 w-9/12 mb-4" />

                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};