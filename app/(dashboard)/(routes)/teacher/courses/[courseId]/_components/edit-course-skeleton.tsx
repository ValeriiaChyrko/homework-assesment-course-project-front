import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import {IconBadge} from "@/components/icon-badge";
import {File, ImageIcon, LayoutDashboard, ListChecks} from "lucide-react";

export const EditCourseSkeleton = () => {
    return (
        <>
            <div className="flex items-center justify-between p-6 mt-12">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Налаштування курсу</h1>
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
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">Персоналізуйте свій курс</h2>
                    </div>
                    <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-36" />
                    <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-36" />
                    <div className="relative w-full h-48 mt-8">
                        <Skeleton className="w-full h-full bg-slate-50 border border-gray-200" />
                        <ImageIcon className="absolute inset-0 m-auto text-gray-400 w-12 h-12" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2 className="text-xl">Тематичне наповнення курсу</h2>
                        </div>
                        <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-48" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={File} />
                        <h2 className="text-xl">Вкладення та супровідні файли</h2>
                    </div>
                    <Skeleton className="mt-6 bg-slate-50 rounded-lg shadow-lg border border-gray-200 p-6 h-48" />
                </div>
            </div>
        </>
    );
};