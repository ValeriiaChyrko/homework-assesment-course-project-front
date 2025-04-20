"use client";

import qs from "query-string";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {usePathname, useRouter} from "next/navigation";

export const StudentSearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 1000);

    const [isFocused, setIsFocused] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                fullName: debouncedValue,
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedValue, router, pathname]);

    return (
        <div className="relative">
            <Search
                className="h-4 w-4 absolute top-3 left-3"
            />
            <Input
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={
                    `w-full pl-9 rounded-lg text-sm
                    ${isFocused ? 'border-gray-900 text-slate-800' : 'border-gray-900/25 text-slate-600'} transition-all`
                }
                placeholder="Знайти студента за іменем..."
            />
        </div>
    );
};