"use client";

import * as React from "react";
import {
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { AttemptResultsDialog } from "@/app/(dashboard)/(routes)/teacher/analytics/_components/attempt-results-dialog";
import { Assignment, AttemptProgress, Chapter, Course } from "@prisma/client";

interface CourseTableProps {
    courses: (Course & {
        chapters: (Chapter & {
            assignments: (Assignment & {
                attemptProgress: AttemptProgress[];
            })[];
        })[];
    })[];
}

const columns: ColumnDef<any>[] = [
    {
        accessorKey: "courseTitle",
        header: "Назва курсу",
        cell: ({ row }) => <span>{row.original.courseTitle}</span>,
    },
    {
        accessorKey: "chapterTitle",
        header: "Назва розділу",
        cell: ({ row }) => <span>{row.original.chapterTitle}</span>,
    },
    {
        accessorKey: "assignmentTitle",
        header: "Назва завдання",
        cell: ({ row }) => <span>{row.original.assignmentTitle}</span>,
    },
    {
        accessorKey: "actions",
        header: "Дії",
        cell: ({ row }) => (
            <AttemptResultsDialog
                courseTitle={row.original.courseTitle}
                chapterTitle={row.original.chapterTitle}
                assignment={row.original.assignment}
            />
        ),
    },
];

export function CourseTable({ courses }: CourseTableProps) {
    const flattenedData = courses.flatMap(course =>
        course.chapters.flatMap(chapter =>
            chapter.assignments.map(assignment => ({
                courseTitle: course.title,
                chapterTitle: chapter.title,
                assignmentTitle: assignment.title,
                assignment,
            }))
        )
    );

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: flattenedData,
        columns,
        state: {
            sorting,
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
    });

    return (
        <div>
            <div className="rounded-md border mx-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    Немає даних
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Попередня
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Наступна
                </Button>
            </div>
        </div>
    );
}