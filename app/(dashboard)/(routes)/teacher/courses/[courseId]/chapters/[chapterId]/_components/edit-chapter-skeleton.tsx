import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import {IconBadge} from "@/components/icon-badge";
import {Eye, LaptopMinimalCheck, LayoutDashboard, Video} from "lucide-react";

export const EditChapterSkeleton = () => {
    return (
        <>
            <div className="flex items-center justify-between p-6 mt-12">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Налаштування розділу курсу</h1>
                    <span className="text-sm text-slate-700">
                            Завершіть заповнення всіх полів
                    </span>
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className="bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 w-32" />
                    <Skeleton className="bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 w-8" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-6">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Персоналізуйте свій розділ</h2>
                        </div>
                        <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-28" />
                        <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-28" />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">Мультимедійні матеріали</h2>
                        </div>
                        <div className="relative w-full h-60 mt-6">
                            <Skeleton className="w-full h-full bg-slate-50 border border-gray-200" />
                            <Video className="absolute inset-0 m-auto text-gray-400 w-12 h-12" />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye} />
                            <h2 className="text-xl">Налаштування доступу</h2>
                        </div>
                        <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-36" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LaptopMinimalCheck} />
                        <h2 className="text-xl">Завдання для самостійної роботи</h2>
                    </div>
                    <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-36" />
                </div>
            </div>
        </>
    );
};