"use client"

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";

const PlusCircle = dynamic(() => import("lucide-react").then((mod) => mod.PlusCircle), { ssr: false });

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isFocused, setIsFocused] = useState(false);

    const columnsMemo = useMemo(() => columns, [columns]);
    const dataMemo = useMemo(() => data, [data]);

    const table = useReactTable({
        data: dataMemo,
        columns: columnsMemo,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters },
    });

    const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        table.getColumn("title")?.setFilterValue(event.target.value);
    }, [table]);

    return (
        <div>
            <div className="flex items-center py-4 justify-between">
                <Input
                    placeholder="Фільтрувати за назвою..."
                    aria-label="Фільтрувати курс за назвою"
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={handleFilterChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-[400px] pl-6 mr-4 rounded-full bg-slate-50 border 
                    ${isFocused ? 'border-gray-900 text-slate-800' : 'border-gray-900/25 text-slate-600'} transition-all`}
                />
                <Link href="/teacher/create" aria-label="Створити новий курс">
                    <Button aria-label="Створити новий курс">
                        <span className="hidden lg:!flex items-center">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Створити новий курс
                        </span>
                        <PlusCircle className="block h-4 w-4 lg:!hidden" />
                    </Button>
                </Link>
            </div>
            <div className="rounded-md border border-gray-900/25">
                <Table className="table-auto w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-gray-900/25">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="border-gray-900/25 hover:bg-sky-100">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Немає доступних даних для відображення.
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
                    aria-label="Наступна сторінка"
                >
                    Попередня
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Попередня сторінка"
                >
                    Наступна
                </Button>
            </div>
        </div>
    );
}