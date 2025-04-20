import {cn} from "@/lib/utils";

interface AnalyticsCardProps {
    variant? : "default" | "success" | "warning" | "danger",
    label: string,
    value: string,
}

const styleClass = {
    success: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    danger: "bg-rose-50 border border-red-400 text-rose-700",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
    default: "bg-sky-50 border border-sky-200 text-sky-800",
};

export const AnalyticsCard = ({
                             variant = "default",
                             value,
                             label,
                         }: AnalyticsCardProps) => {
    return (
        <div
            className={cn(
                "w-full py-4 px-6 rounded-lg",
                styleClass[variant]
            )}
        >
            <div className="text-xs md:!text-md">{label}</div>
            <div className="text-lg md:!text-3xl font-bold">{value}</div>
        </div>
    )
}