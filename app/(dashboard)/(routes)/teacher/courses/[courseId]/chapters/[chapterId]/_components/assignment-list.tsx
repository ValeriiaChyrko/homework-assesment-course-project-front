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

interface Assignment {
    id: string;
    title: string;
    isPublished: boolean;
}

interface AssignmentListProps {
    items: Assignment[];
    onReorderAction: (updateData: { id: string; position: number }[]) => void;
    onEditAction: (id: string) => void;
}

export const AssignmentList = ({
                                   items,
                                   onReorderAction,
                                   onEditAction
                               }: AssignmentListProps) => {
    const [assignments, setAssignments] = useState<Assignment[]>(items);

    useEffect(() => {
        setAssignments(items);
    }, [items]);

    const onDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return;

        const updatedAssignments = Array.from(assignments);
        const [reorderedItem] = updatedAssignments.splice(result.source.index, 1);
        updatedAssignments.splice(result.destination.index, 0, reorderedItem);

        const bulkUpdatedData = updatedAssignments.map((assignment, index) => ({
            id: assignment.id,
            position: index,
        }));

        setAssignments(updatedAssignments);
        onReorderAction(bulkUpdatedData);
    }, [assignments, onReorderAction]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {assignments.map((assignment, index) => (
                            <Draggable
                                key={assignment.id}
                                draggableId={assignment.id}
                                index={index}
                                aria-label="Змінити порядок завдань"
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-900 rounded-md mb-4 text-sm",
                                            assignment.isPublished && "bg-sky-100 border-sky-200 text-sky-900"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-2 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                assignment.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-5 w-5" aria-label="Перетягнути" />
                                        </div>
                                        {assignment.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            <Badge
                                                className={cn(
                                                    "bg-slate-700 pb-1",
                                                    assignment.isPublished && "bg-sky-700"
                                                )}
                                            >
                                                {assignment.isPublished ? "Опублікований" : "Чернетка"}
                                            </Badge>
                                            <PencilIcon
                                                onClick={() => onEditAction(assignment.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75"
                                                aria-label="Редагувати"
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