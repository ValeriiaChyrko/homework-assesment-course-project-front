"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis} from "recharts";

interface ChartProps {
    data: {
        title: string,
        total: number
    }[];
}

export const Chart = ({
                          data
                      }: ChartProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleMouseEnter = (data: ChartProps, index: number) => {
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    return (
        <Card className="pt-4 border border-gray-200">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="title"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${Math.floor(value)}`}
                        allowDecimals={false}
                        interval={1}
                    />
                    <Bar
                        dataKey="total"
                        fill="#0369a1"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={150}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        isAnimationActive={false}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={activeIndex === index ? "#FF55BBE6" : "#0369a1"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};