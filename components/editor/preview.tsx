"use client";

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {cn} from "@/lib/utils";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import {Table} from "@tiptap/extension-table";
import {TableCell} from "@tiptap/extension-table-cell";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableRow} from "@tiptap/extension-table-row";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import {FontFamily} from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";
import Code from "@tiptap/extension-code";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";

interface PreviewProps {
    value: string;
    className?: string;
}

export const Preview = ({ value, className }: PreviewProps) => {
    const localEditor = useEditor({
        extensions: [
            StarterKit,
            TaskItem.configure({
                nested: true,
            }),
            TaskList,
            Table,
            TableCell,
            TableHeader,
            TableRow,
            Image,
            ImageResize,
            Underline,
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle.configure({ mergeNestedSpanStyles: true }),
            Color,
            Code,
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: true,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https']
            })
        ],
        content: value,
        editable: false,
        immediatelyRender: false
    });

    return (
        <div className={cn("w-full caption-bottom mt-2", className)}>
            <EditorContent editor={localEditor} />
        </div>
    );
};