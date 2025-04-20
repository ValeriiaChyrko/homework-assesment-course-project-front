"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import {IconType} from "react-icons";

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: IconType;
}

export const CategoryItem = ({
                                 label,
                                 value,
                                 icon: Icon,
                             }: CategoryItemProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = async () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    }

    return (
        <Button
            variant="ghost"
            onClick={onClick}
            className={cn(
                "w-full max-w-[500px] p-4 text-sm rounded-lg hover:border-sky-700 transition flex items-center justify-start gap-2",
                isSelected && "border-sky-200/20 bg-sky-200/20"
            )}
        >
            {Icon && <Icon size={20} />}
            <span>{label}</span>
        </Button>
    );
};