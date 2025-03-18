"use client"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import {TableCell} from "@tiptap/extension-table-cell";
import {Table} from "@tiptap/extension-table";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableRow} from "@tiptap/extension-table-row";
import {FontFamily} from "@tiptap/extension-font-family";
import {Color} from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Code from '@tiptap/extension-code';

import {useEditorStore} from "@/components/editor/store/use-editor-store";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
    const {setEditor} = useEditorStore();

    const editor = useEditor({
        onCreate({editor}){
            setEditor(editor)
        },
        onDestroy() {
            setEditor(null)
        },
        onUpdate({ editor }) {
            setEditor(editor);
            onChange(editor.getHTML());
        },
        onSelectionUpdate({editor}){
            setEditor(editor)
        },
        onTransaction({editor}){
            setEditor(editor)
        },
        onFocus({editor}){
            setEditor(editor)
        },
        onBlur({editor}){
            setEditor(editor)
        },
        onContentError({editor}){
            setEditor(editor)
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none p-3 rounded-lg border border-gray-400 flex flex-col w-full cursor-text"
            }
        },
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
    });

    return (
        <div className="w-full bg-slate-50">
            <div className="max-w-[680px] w-full mx-auto">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};