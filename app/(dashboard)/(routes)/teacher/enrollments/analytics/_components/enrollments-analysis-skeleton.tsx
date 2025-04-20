"use client";

import * as React from "react";
import {DataCard} from "@/app/(dashboard)/(routes)/teacher/enrollments/analytics/_components/data-card";
import {GraduationCap} from "lucide-react";

export function EnrollmentsAnalysisSkeleton() {

    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <DataCard
                    value={0}
                    label="Загальна кількість студентів"
                    icon={GraduationCap}
                />
            </div>
            <div className="h-[350px] w-full border border-gray-200 bg-gray-100 rounded-md animate-pulse" />
        </div>
    );
}