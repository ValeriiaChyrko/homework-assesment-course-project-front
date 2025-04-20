import * as React from "react";
import {Check, ChevronDown, ChevronRight} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";

interface ComboboxProps {
    options: { label: string; value: string }[];
    value?: string;
    onChangeAction: (value: string) => void;
    size?: "sm" | "md" | "lg";
}

const sizeClass = {
    sm: "text-sm md:max-w-xs",
    md: "text-sm",
    lg: "text-lg",
};

export function Combobox({
                             options,
                             value,
                             onChangeAction,
                             size = "md",
                         }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [activeOption, setActiveOption] = React.useState<number | null>(null);

    const filteredOptions = React.useMemo(() =>
        options.filter(option =>
            option.label.toLowerCase().includes(search.toLowerCase())
        ), [options, search]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveOption(prev => (prev === null || prev === filteredOptions.length - 1 ? 0 : prev + 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveOption(prev => (prev === null || prev === 0 ? filteredOptions.length - 1 : prev - 1));
                break;
            case "Enter":
                if (activeOption !== null) {
                    onChangeAction(filteredOptions[activeOption].value);
                    resetCombobox();
                }
                break;
            case "Escape":
                resetCombobox();
                break;
        }
    };

    const resetCombobox = () => {
        setOpen(false);
        setSearch("");
        setActiveOption(null);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    aria-activedescendant={activeOption !== null ? `option-${activeOption}` : undefined}
                    className={cn(
                        "w-full rounded-lg text-gray-700 bg-slate-50 border border-gray-300 focus:ring-2 justify-between truncate",
                        sizeClass[size]
                    )}
                >
                    <span className="truncate max-w-[calc(100%-2.5rem)]">
                        {value
                            ? options.find(option => option.value === value)?.label
                            : "Оберіть опцію..."}
                    </span>

                    <span className="flex items-center gap-3 pl-2">
                        <Separator orientation="vertical" className="h-4 bg-gray-300" />
                        {open
                            ? <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                            : <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-2 bg-slate-50 border border-gray-300">
                <Command>
                    <Input
                        placeholder="Знайти опцію..."
                        className={cn(
                            "pl-6 rounded-lg text-gray-700 bg-slate-50 border border-gray-300 focus:ring-2",
                            sizeClass[size]
                        )}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        aria-label="Search options"
                    />
                    <CommandList>
                        {filteredOptions.length === 0 ? (
                            <CommandEmpty
                                className={cn(
                                    "py-2 text-lg text-gray-700 text-center italic",
                                    sizeClass[size]
                                )}
                            >
                                Опцію не знайдено
                            </CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredOptions.map((option, index) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            onChangeAction(option.value);
                                            resetCombobox();
                                        }}
                                        className={cn(
                                            "mt-2 text-gray-700 hover:text-sky-700 hover:bg-sky-100",
                                            activeOption === index ? "bg-sky-50" : "",
                                            "transition-colors duration-200",
                                            sizeClass[size]
                                        )}
                                        id={`option-${index}`}
                                        aria-selected={activeOption === index}
                                        role="option"
                                        tabIndex={0}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}