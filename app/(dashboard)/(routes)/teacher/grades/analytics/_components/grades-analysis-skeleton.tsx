"use client";

import * as React from "react";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

export function GradesAnalysisSkeleton() {
    return (
        <div className="p-6 flex flex-col gap-x-4">
            <div className="space-x-6 w-xs rounded-lg shadow-lg border bg-slate-50 border-gray-200 px-6 py-4">
                <div className="font-semibold text-md mb-1 mt-4">Назва курсу</div>
                <Combobox
                    size="sm"
                    options={[]}
                    value=""
                    onChangeAction={() => { }}
                />
                <Button
                    disabled={true}
                    type="submit"
                    className="mt-6 w-full transition-colors rounded-lg"
                >
                    Показати результати
                </Button>
            </div>
        </div>
    );
}