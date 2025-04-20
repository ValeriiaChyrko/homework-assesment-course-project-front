"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentGrade {
    studentFullName: string;
    compilationScore: number;
    qualityScore: number;
    testsScore: number;
    finalScore: number;
}

export const columns: ColumnDef<StudentGrade>[] = [
    {
        accessorKey: "index",
        header: () => (
            <div className="text-center">
                №
            </div>
        ),
        cell: ({ row }) => <div className="text-center w-10">{row.index + 1}</div>,
    },
    {
        accessorKey: "studentFullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
                aria-label="Прізвище та ім’я студента"
                className="w-full justify-start"
            >
                Прізвище та ім’я
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="text-justify w-full whitespace-normal break-words">
                {row.getValue("studentFullName")}
            </div>
        ),
    },

    {
        id: "scoreGroup",
        header: () => (
            <div className="border-x border-gray-200 text-center font-semibold">
                Розподіл балів
            </div>
        ),
        columns: [
            {
                accessorKey: "compilationScore",
                header: "Компіляція",
                cell: ({ row }) => (
                    <div className="text-center w-20">
                        {row.getValue("compilationScore")}
                    </div>
                ),
            },
            {
                accessorKey: "qualityScore",
                header: "Якість коду",
                cell: ({ row }) => (
                    <div className="text-center w-20">
                        {row.getValue("qualityScore")}
                    </div>
                ),
            },
            {
                accessorKey: "testsScore",
                header: "Тестування",
                cell: ({ row }) => (
                    <div className="text-center w-20">
                        {row.getValue("testsScore")}
                    </div>
                ),
            },
            {
                accessorKey: "finalScore",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        aria-label="Підсумковий бал"
                        className="w-full justify-center px-2"
                    >
                        Підсумковий
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const score = row.original.finalScore as number;
                    return <div className="font-medium text-center">{score}</div>;
                },
            },
        ],
    },

    {
        accessorKey: "ectsGrade",
        header: "ECTS",
        cell: ({ row }) => {
            const score = row.original.finalScore as number;
            let grade = "F";
            let variant:
                | "grade-a"
                | "grade-b"
                | "grade-c"
                | "grade-d"
                | "grade-e"
                | "grade-f" = "grade-f";

            if (score >= 91) {
                grade = "A";
                variant = "grade-a";
            } else if (score >= 83) {
                grade = "B";
                variant = "grade-b";
            } else if (score >= 76) {
                grade = "C";
                variant = "grade-c";
            } else if (score >= 68) {
                grade = "D";
                variant = "grade-d";
            } else if (score >= 61) {
                grade = "E";
                variant = "grade-e";
            }

            return (
                <div className="font-medium text-center w-full">
                    <Badge variant={variant} className="font-semibold">
                        {grade}
                    </Badge>
                </div>
            );
        },
    },
];