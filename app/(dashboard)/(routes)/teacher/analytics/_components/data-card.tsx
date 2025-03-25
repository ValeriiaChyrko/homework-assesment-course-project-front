import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {LucideIcon} from "lucide-react";

interface DataCardProps {
    value: number;
    label: string;
    icon: LucideIcon;
}
export const DataCard = ({
    value,
    label,
    icon: Icon,
}: DataCardProps) => {
    return (
        <Card className="border border-gray-200 rounded-xl p-4 bg-white block">
        <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-700 flex items-center space-x-4">
                    <Icon className="h-8 w-8 opacity-90 text-gray-700/80" />
                    <span>{label}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {value}
                </div>
            </CardContent>
        </Card>
    )
}