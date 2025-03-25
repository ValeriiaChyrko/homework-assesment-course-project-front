import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import Link from "next/link";
import React from "react";

interface AssignmentInfoBlockProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string | null;
    variant: "success" | "default";
    url?: string | null;
    action?: React.ReactNode | null;
}

export const AssignmentInfoBlock: React.FC<AssignmentInfoBlockProps> = ({
                                                                            icon,
                                                                            title,
                                                                            subtitle,
                                                                            variant,
                                                                            url,
                                                                            action,
                                                                        }) => {
    const TitleComponent = url ? (
        <Link href={url} className="text-slate-700 text-sm hover:underline block">
            {title}
        </Link>
    ) : (
        <p className="text-slate-500 text-sm">{title}</p>
    );

    return (
        <div className="flex items-center gap-4 p-3 border border-gray-900/25 rounded-lg shadow-sm">
            <IconBadge icon={icon} variant={variant} />
            <div className="space-y-0.5">
                {TitleComponent}
                {subtitle && <p className="text-slate-900 font-semibold">{subtitle}</p>}
                {action}
            </div>
        </div>
    );
};