"use client"

import {PolarAngleAxis, PolarGrid, Radar, RadarChart} from "recharts"

import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"

export default function PlayerStatisticRadar({coloreSquadra, mvp = 0, goal = 0, assist = 0, gialli = 0, rossi = 0}: {
    coloreSquadra: string,
    mvp: number,
    goal: number,
    assist: number,
    gialli: number,
    rossi: number,
}) {
    const chartColor = coloreSquadra.startsWith("#")
        ? coloreSquadra
        : "#" + coloreSquadra;

    const chartData = [
        {azione: "Goal", valore: goal},
        {azione: "Assist", valore: assist},
        {azione: "Gialli", valore: gialli},
        {azione: "Rossi", valore: rossi},
        {azione: "MVP", valore: mvp},
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: chartColor,
        },
    } satisfies ChartConfig;

    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto w-full aspect-square max-h-[250px] sm:max-h-[350px]"
        >
            <RadarChart data={chartData}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarGrid className="fill-(--color-desktop) opacity-20" />
                <PolarAngleAxis dataKey="azione" />
                <Radar
                    dataKey="valore"
                    fill={chartColor}
                    fillOpacity={0.4}
                    dot={{
                        r: 4,
                        fillOpacity: 0.8,
                    }}
                />
            </RadarChart>
        </ChartContainer>
    )
}
