import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

interface ComboboxProps {
    options: { label: string; value: string }[];
    value?: string;
    onChangeAction: (value: string) => void;
}

export function Combobox({
                             options,
                             value,
                             onChangeAction
                         }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    className="w-full justify-between"
                >
                    {value
                        ? options.find(option => option.value === value)?.label
                        : "Оберіть опцію..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-slate-50">
                <Command>
                    <input
                        type="text"
                        placeholder="Знайти опцію..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex h-10 w-full rounded-md bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <CommandList>
                        {filteredOptions.length === 0 ? (
                            <CommandEmpty>Опцію не знайдено.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredOptions.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => {
                                            const newValue = option.value === value ? "" : option.value;
                                            onChangeAction(newValue);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        className="hover:text-sky-700 hover:bg-sky-50"
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