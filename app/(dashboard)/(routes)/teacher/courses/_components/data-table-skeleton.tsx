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

export function DataTableSkeleton() {
    const columns = Array(5).fill(null);

    return (
        <>
            <div className="flex items-center py-4 justify-between">
                <div className="h-10 w-[400px] bg-gray-200 rounded-full animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse" />
            </div>
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
        </>
    );
}