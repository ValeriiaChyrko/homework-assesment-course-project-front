"use client"

import {ColumnDef} from "@tanstack/react-table"
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {format} from "date-fns";

export const courseColumns: ColumnDef<AttemptProgress>[] = [
    {
        accessorKey: "userId",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Студент
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "finalScore",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Оцінка
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "position",
        header: "Спроба №",
    },
    {
        accessorKey: "createdAt",
        header: "Дата виконання",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return format(date, "dd.MM.yyyy");
        }
    }
]