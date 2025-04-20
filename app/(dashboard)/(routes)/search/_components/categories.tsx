"use client"

import {CategoryItem} from "@/app/(dashboard)/(routes)/search/_components/category-item";

interface CategorisProps {
    items: Category[];
}

export const Categories = ({
    items,
}: CategorisProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 overflow-y-auto px-10 pt-8 scroll-container">
            {items.map((category) => (
                <CategoryItem
                    key={category.id}
                    label={category.name}
                    value={category.id}
                />
            ))}
        </div>
    )
}