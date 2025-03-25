import {cn} from "@/lib/utils";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
}

const colorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700",
}

const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
}

export const CourseProgress = ({
    value,
    variant = "default",
    size = "default",
} : CourseProgressProps) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <p className={cn(
                    "font-medium text-sky-700",
                    colorByVariant[variant],
                    sizeByVariant[size],
                )}>
                    Пройдено: <span className="ml-2">{Math.round(value)}%</span>
                </p>
            </div>
            <div className="flex items-center justify-between mb-4">
                <div
                    role="progressbar"
                    aria-valuenow={value ?? 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Прогрес"
                    className="relative w-full overflow-hidden rounded-full h-2 bg-emerald-100"
                >
                    <div
                        style={{ width: `${value ?? 0}%` }}
                        className="bg-emerald-500 h-full"
                    />
                </div>
            </div>
        </div>
    )
}