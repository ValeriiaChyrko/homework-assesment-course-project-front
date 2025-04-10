"use client";

import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon, AlignRightIcon,
    BoldIcon,
    ChevronDownIcon,
    HighlighterIcon,
    ImageIcon,
    ItalicIcon,
    Link2Icon,
    ListIcon,
    ListOrderedIcon,
    ListTodoIcon,
    LucideIcon,
    Redo2Icon,
    RemoveFormattingIcon,
    SearchIcon,
    SquareDashedBottomCodeIcon,
    UnderlineIcon,
    Undo2Icon,
    UploadIcon
} from "lucide-react";
import {cn} from "@/lib/utils";
import {useEditorStore} from "@/components/editor/store/use-editor-store";
import {Separator} from "@/components/ui/separator";
import {type Level} from "@tiptap/extension-heading"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {SketchPicker, type ColorResult} from "react-color";
import { useState } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {FileUpload} from "@/components/file-upload";

const LineListButton = () => {
    const {editor} = useEditorStore();

    const lists = [
        {
            label: "Маркований список",
            icon: ListIcon,
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleBulletList().run()
        },
        {
            label: "Нумерований список",
            icon: ListOrderedIcon,
            isActive: () => editor?.isActive("orderedList"),
            onClick: () => editor?.chain().focus().toggleOrderedList().run()
        },
        {
            label: "Список з прапорцями",
            icon: ListTodoIcon,
            isActive: () => editor?.isActive("taskList"),
            onClick: () => editor?.chain().focus().toggleTaskList().run(),
        },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Список типів спискув для тексту"
                    className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-slate-300/80 px-1.5 overflow-hidden text-sm"
                >
                    <ListTodoIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-100 border border-slate-300 p-1 flex flex-col gap-y-1">
                {lists.map(({ label, icon:Icon, onClick, isActive }) => (
                    <button
                        key={label}
                        aria-label={label}
                        onClick={onClick}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-slate-300/80",
                            isActive() && "bg-gray-300/80"
                        )}
                    >
                        <Icon className="size-4"/>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const AlignTextButton = () => {
    const {editor} = useEditorStore();

    const alignments = [
        {
            label: "Вирівняти зліва",
            value: "left",
            icon: AlignLeftIcon
        },
        {
            label: "Вирівняти по центру",
            value: "center",
            icon: AlignCenterIcon
        },
        {
            label: "Вирівняти справа",
            value: "right",
            icon: AlignRightIcon
        },
        {
            label: "Вирівняти по ширині",
            value: "justify",
            icon: AlignJustifyIcon
        }
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Список вирівнювання для тексту"
                    className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-slate-300/80 px-1.5 overflow-hidden text-sm"
                >
                    <AlignLeftIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-100 border border-slate-300 p-1 flex flex-col gap-y-1">
                {alignments.map(({ label, value, icon:Icon }) => (
                    <button
                        key={value}
                        aria-label={label}
                        onClick={() => editor?.chain().focus().setTextAlign(value).run()}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-slate-300/80",
                            editor?.isActive({textAlign:value}) && "bg-gray-300/80"
                        )}
                    >
                        <Icon className="size-4"/>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploadDialog, setIsUploadDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run();
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setIsDialogOpen(false);
            setIsUploadDialog(false);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setIsUploadDialog(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        aria-label="Додавання зображення"
                        className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-slate-300/80 px-1.5 overflow-hidden text-sm"
                    >
                        <ImageIcon className="size-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2.5 flex items-center gap-x-2 bg-slate-100 border border-slate-300">
                    <DropdownMenuItem onClick={() => { setIsUploadDialog(true); setIsDialogOpen(true); }}>
                        <UploadIcon className="size-4 mr-2" />
                        Завантажити локально
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setIsDialogOpen(true); setIsUploadDialog(false); }}>
                        <SearchIcon className="size-4 mr-2" />
                        Вставити URL фотографії
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Діалог вставки URL */}
            {isDialogOpen && !isUploadDialog && (
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogContent style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        maxWidth: '500px',
                        zIndex: 1000,
                    }}>
                        <DialogHeader>
                            <DialogTitle className="py-4">Вставити URL фотографії</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder="Вставте URL зображення"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleImageUrlSubmit();
                                }
                            }}
                            className="p-4"
                        />
                        <DialogFooter className="mt-4">
                            <Button onClick={handleImageUrlSubmit}>Застосувати</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Діалог завантаження локально */}
            {isDialogOpen && isUploadDialog && (
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogContent style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        maxWidth: '500px',
                        zIndex: 1000,
                    }}>
                        <DialogHeader>
                            <DialogTitle className="mt-4">Завантажити локально</DialogTitle>
                        </DialogHeader>
                        <FileUpload
                            endpoint="courseImage"
                            onChangeAction={(url?: string) => {
                                if (url) {
                                    setImageUrl(url);
                                    handleImageUrlSubmit();
                                }
                            }}
                        />
                        <DialogFooter className="mt-4 flex flex-col">
                            <Button onClick={handleImageUrlSubmit}>Завершити</Button>
                            <div className="text-xs text-muted-foreground text-gray-700 mt-2">
                                Зображенню потрібно декілька секунд щоб відобразитись.
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

const LinkButton = () => {
    const {editor} = useEditorStore();
    const [value, setValue] = useState('');

    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({href}).run();
        setValue("");
    };

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                setValue(editor?.getAttributes("link").href || '')}
            }
        }>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Створення глобального покликання"
                    className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-slate-300/80 px-1.5 overflow-hidden text-sm"
                >
                    <Link2Icon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2.5 flex items-center gap-x-2 bg-slate-100 border border-slate-300">
                <Input
                    placeholder="https://example.com"
                    aria-label="Вставте покликання"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={ (e) => {
                        if (e.key === "Enter") {
                            onChange(value)
                        }
                    }}
                    className="w-full p-3 rounded-lg border border-gray-400"
                />
                <Button
                    onClick={() => onChange(value)}
                >
                    Застосувати
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const HighlightColorButton = () => {
    const {editor} = useEditorStore();

    const value = editor?.getAttributes("highlight").color || "#ffffff";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({color: color.hex}).run();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Список кольорів для фону"
                    className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-slate-300/80 px-1.5 overflow-hidden text-sm"
                >
                    <HighlighterIcon className="size-4"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 border-0">
                <SketchPicker
                    color={value}
                    onChange={onChange}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const TextColorButton = () => {
    const {editor} = useEditorStore();

    const value = editor?.getAttributes("textStyle").color || "#000000";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Список кольорів"
                    className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-slate-300/80 px-1.5 overflow-hidden text-sm"
                >
                    <span className="text-xs">A</span>
                    <div className="h-0.5 w-full" style={{ backgroundColor: value }}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 border-0">
                <SketchPicker
                    color={value}
                    onChange={onChange}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const HeadingLevelButton = () => {
    const {editor} = useEditorStore();
    const headings = [
        {label: "Звичайний текст", value: 0, fontSize: "14px"},
        {label: "Заголовок 1", value: 1, fontSize: "32px"},
        {label: "Заголовок 2", value: 2, fontSize: "24px"},
        {label: "Заголовок 3", value: 3, fontSize: "20px"},
        {label: "Заголовок 4", value: 4, fontSize: "18px"},
        {label: "Заголовок 5", value: 5, fontSize: "16px"},
    ];

    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++){
            if (editor?.isActive("heading", {level})){
                return `Заголовок ${level}`;
            }
        }

        return "Звичайний текст";
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Список рівнів заголовків"
                    className="h-7 w-[146px] shrink-0 flex items-center justify-center rounded-sm hover:bg-slate-300/80 pl-1.5 overflow-hidden text-sm"
                >
                   <span className="truncate">
                        {getCurrentHeading()}
                   </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1 bg-slate-100 border border-slate-300">
                {headings.map(({label, value, fontSize}) => (
                    <button
                        onClick={() => {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            } else {
                                editor?.chain().focus().toggleHeading({level: value as Level}).run();
                            }
                        }}
                        key={value}
                        aria-label={label}
                        style={{fontSize}}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-slate-200/80",
                            (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", {level: value}) && "bg-slate-200/80"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
const FontFamilyButton = () => {
    const {editor} = useEditorStore();

    const fonts = [
        {label: "Arial", value: "Arial"},
        {label: "Times New Roman", value: "Times New Roman"},
        {label: "Courier New", value: "Courier New"},
        {label: "Georgia", value: "Georgia"},
        {label: "Verdana", value: "Verdana"}
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Список мов"
                    className="h-7 w-[116px] shrink-0 flex items-center justify-between rounded-sm hover:bg-slate-300/80 pl-1.5 overflow-hidden text-sm"
                >
                   <span className="truncate">
                        {editor?.getAttributes("textStyle").fontFamily || "Arial"}
                   </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-1 bg-slate-100 border border-slate-300">
                {fonts.map(({label, value}) => (
                    <button
                        onClick={() => editor?.chain().focus().setFontFamily(value).run()}
                        key={value}
                        aria-label={label}
                        className={cn(
                            "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-slate-200/80",
                            editor?.getAttributes("textStyle").fontFamily === value && "bg-slate-200/80"
                        )}
                        style={{fontFamily: value}}
                    >
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface ToolbarButtonProps {
    onClick?: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}

const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
} : ToolbarButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-slate-300/80",
                isActive && "bg-slate-300/80",
            )}
            aria-label="Кнопка"
        >
            <Icon className="size-4"/>
        </button>
    )
}

export const Toolbar = () => {
    const {editor} = useEditorStore();
    const sections: {
        label: string,
        icon: LucideIcon,
        onClick?: () => void,
        isActive?: boolean,
    }[][] = [
        [
            {
                label: "Undo",
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "Redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            }
        ],
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: editor?.isActive("bold"),
                onClick: () => editor?.chain().focus().toggleBold().run(),
            },
            {
                label: "Italic",
                icon: ItalicIcon,
                isActive: editor?.isActive("italic"),
                onClick: () => editor?.chain().focus().toggleItalic().run(),
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("underline"),
                onClick: () => editor?.chain().focus().toggleUnderline().run(),
            }
        ],
        [
            {
                label: "Code",
                icon: SquareDashedBottomCodeIcon,
                onClick: () => editor?.chain().focus().toggleCode().run(),
            },
            {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),
            }
        ]
    ];

    return (
        <div className="w-full items-center justify-center bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex gap-x-0.35 overflow-x-auto editor-container">
        {sections[0].map((section) => (
                <ToolbarButton key={section.label} {...section} />
            ))}
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            <FontFamilyButton/>
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            <HeadingLevelButton/>
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            {sections[1].map((section) => (
                <ToolbarButton key={section.label} {...section} />
            ))}
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            <TextColorButton/>
            <HighlightColorButton/>
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            <LinkButton/>
            <ImageButton/>
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            <AlignTextButton/>
            <LineListButton/>
            <Separator orientation="vertical" className="ml-1 h-6 bg-slate-400" />
            {sections[2].map((section) => (
                <ToolbarButton key={section.label} {...section} />
            ))}
        </div>
    );
};