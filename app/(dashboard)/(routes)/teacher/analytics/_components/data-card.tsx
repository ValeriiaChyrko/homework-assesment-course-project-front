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
        <Card className="rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Icon className="text-xl" />
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