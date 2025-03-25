import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "lucide-react";
import React from "react";

export const ChapterSkeleton = () => {
    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Success Banner Skeleton */}
            <Skeleton className="h-12 w-full mb-4 mt-1" />

            {/* Locked Section Skeleton */}
            <div className="pt-[60px] flex flex-col justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative w-120 h-60">
                        <Skeleton className="w-full h-full bg-slate-50 border border-gray-200" />
                        <Video className="absolute inset-0 m-auto text-gray-400 w-12 h-12" />
                    </div>
                </div>
                <div className="mt-4 p-4">
                    <Skeleton className="h-8 w-80 mb-2" />
                    <Skeleton className="h-6 w-60" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="p-4">
                <Skeleton className="h-36 w-full" />
            </div>
            <div className="space-y-4">
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <Skeleton className="h-8 w-63 mb-2" />
                    <Skeleton className="h-10 w-48" />
                </div>
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