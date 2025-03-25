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
import {DataCard} from "@/app/(dashboard)/(routes)/teacher/analytics/_components/data-card";
import {GraduationCap, School} from "lucide-react";

export function AnalisysSkeleton() {
    const columns = Array(5).fill(null);

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
            <DataCard
                value={0}
                label="Статистика активності студентів"
                icon={School}
            />
            <div className="rounded-md border border-gray-200">
                <Table className="table-auto w-full">
                    <TableHeader>
                        <TableRow className="border-gray-200">
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