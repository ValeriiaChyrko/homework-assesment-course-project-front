import {LucideIcon} from "lucide-react";
import {IconBadge} from "@/components/icon-badge";
import Link from "next/link";

interface AssignmentInfoBlockProps {
    icon: LucideIcon
    title: string,
    subtitle: string,
    variant: "success" | "default",
    url?: string | null,
    action?: React.ReactNode | null;
}

export const AssignmentInfoBlock = ({
    icon,
    title,
    subtitle,
    variant,
    url,
    action
}: AssignmentInfoBlockProps) => {
    return (
        <div className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
            <IconBadge icon={icon} variant={variant} />
            <div className="space-y-2">
                {url ? (
                    <Link href={url} className="text-slate-500 text-sm hover:underline">
                        {title}
                    </Link>
                ) : (
                    <p className="text-slate-500 text-sm">{title}</p>
                )}
                <p className="text-slate-900 font-semibold">{subtitle}</p>
                {action}
            </div>
        </div>
    );
};