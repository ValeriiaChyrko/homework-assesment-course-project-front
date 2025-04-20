"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {AnalyticsCard} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/analytics-card";
import {StudentSearchInput} from "@/app/(dashboard)/(routes)/teacher/grades/analytics/_components/student-search-input";

export function GradesDataTableSkeleton() {
    const columns = Array(6).fill(null);

    return (
        <div className="rounded-lg shadow-lg border border-gray-200 px-6 py-4 space-y-4">
            <div className="mt-2 h-8 w-full bg-gray-200 rounded-md animate-pulse" />

            <div className="flex gap-x-4">
                <div className="flex-1">
                    <AnalyticsCard
                        value={`${100}`}
                        label="Середній бал"
                        variant="default"
                    />
                </div>
                <div className="flex-1">
                    <AnalyticsCard
                        value={`${100}`}
                        label="Найвищий бал"
                        variant="default"
                    />
                </div>
                <div className="flex-1">
                    <AnalyticsCard
                        value={`${100}%`}
                        label="Коефіцієнт успішності"
                        variant="default"
                    />
                </div>
            </div>

            <StudentSearchInput/>

            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="rounded-md border border-gray-900/25">
                <Table className="table-auto w-full">
                    <TableHeader>
                        <TableRow className="border-gray-900/25">
                            {columns.map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-4 w-full" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}