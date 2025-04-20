"use client";

import {Table2} from "lucide-react";

export const EmptyAnalyticsPlaceholder = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center text-muted-foreground border border-gray-200 rounded-lg shadow-sm">
            <Table2 className="w-12 h-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold">Статистика ще не згенерована</h3>
            <p className="text-sm text-gray-500 mt-2">
                Виберіть назву курс, розділу та завдання, а потім натисніть <br/> <strong>Показати результати</strong>, щоб переглянути аналітику студентів.
            </p>
        </div>
    );
};
