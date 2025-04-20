"use client";

import {BarChart2} from "lucide-react";

export const EmptyAnalyticsResults = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center text-muted-foreground border border-gray-200 rounded-lg shadow-sm">
            <BarChart2 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-xl font-semibold">Аналітика ще не доступна</h3>
            <p className="text-sm text-muted-foreground mt-1">
                Зачекайте, поки студенти виконають завдання. Ви зможете побачити повну аналітику тут.
            </p>
        </div>
    );
};
