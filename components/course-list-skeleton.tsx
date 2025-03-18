import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";

export const CoursesListSkeleton = () => {
    return (
        <>
            <div className="border border-gray-900/25 rounded-lg">
                <div className="relative w-full h-18">
                    <Skeleton className="w-full h-full" />
                </div>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4">
                {new Array(6).fill(null).map((_, i) => (
                    <Card key={i} className="group hover:shadow-lg transition overflow-hidden border border-gray-900/25 rounded-lg">
                        <CardHeader className="relative">
                            <CardTitle>
                                <div className="relative w-full h-48">
                                    <Skeleton className="w-full h-full" />
                                    <ImageIcon className="absolute inset-0 m-auto text-gray-400 w-12 h-12" />
                                </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="mt-2 h-5 rounded w-3/4" />
                            <Skeleton className="mt-2 h-4 rounded w-5/6" />
                        </CardContent>

                        <CardFooter>
                            <Button variant="secondary" disabled className="w-full">
                                <Skeleton className="h-8 w-full px-6" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );
};