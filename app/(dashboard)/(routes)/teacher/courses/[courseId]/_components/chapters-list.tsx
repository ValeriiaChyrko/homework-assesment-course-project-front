"use client";

import { useEffect, useState, useCallback } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Chapter {
    id: string;
    title: string;
    isPublished: boolean;
}

interface ChaptersListProps {
    items: Chapter[];
    onReorderAction: (updateData: { id: string; position: number }[]) => void;
    onEditAction: (id: string) => void;
}

export const ChaptersList = ({
                                 items,
                                 onReorderAction,
                                 onEditAction
                             }: ChaptersListProps) => {
    const [chapters, setChapters] = useState<Chapter[]>(items);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;

        const reorderedChapters = Array.from(chapters);
        const [movedItem] = reorderedChapters.splice(result.source.index, 1);
        reorderedChapters.splice(result.destination.index, 0, movedItem);

        setChapters(reorderedChapters);

        const updatedData = reorderedChapters.map((chapter, index) => ({
            id: chapter.id,
            position: index,
        }));

        onReorderAction(updatedData);
    }, [chapters, onReorderAction]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                                aria-label="Змінити порядок розділів"
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-900 rounded-md mb-4 text-sm",
                                            chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-900"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                            )}
                                            aria-label="Перетягнути розділ"
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-5 w-5"  aria-label="Перетягнути"/>
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            <Badge
                                                className={cn(
                                                    "bg-slate-700 pb-1",
                                                    chapter.isPublished && "bg-sky-700"
                                                )}
                                            >
                                                {chapter.isPublished ? "Опублікований" : "Чернетка"}
                                            </Badge>
                                            <PencilIcon
                                                onClick={() => onEditAction(chapter.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75"
                                                aria-label="Редагувати розділ"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};