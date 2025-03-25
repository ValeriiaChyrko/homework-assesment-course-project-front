import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const AssignmentSkeleton = () => {
    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="space-y-4">
                <Skeleton className="h-px w-full bg-gray-300" />
                <div className="p-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4 mt-2" />
                </div>
                {/* Assignments Skeleton */}
                <Skeleton className="h-px w-full bg-gray-300" />
                <div className="px-4 pt-2 space-y-2 mt-4">
                    <Skeleton className="h-6 w-64 mb-6" />
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
                {/* Attachments Skeleton */}
                <Skeleton className="h-px w-full bg-gray-300" />
                <div className="px-4 pt-2 space-y-2 mt-4">
                    <Skeleton className="h-6 w-64 mb-6" />
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}