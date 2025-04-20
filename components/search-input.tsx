"use client";

import qs from "query-string";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {useDebounce} from "@/hooks/use-debounce";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 2000);

    const [isFocused, setIsFocused] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue,
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname]);

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
                    `w-full pl-9 rounded-lg bg-slate-50 border 
                    ${isFocused ? 'border-gray-900 text-slate-800' : 'border-gray-900/25 text-slate-600'} transition-all`
                }
                placeholder="Знайти курс за назвою..."
            />
        </div>
    );
};