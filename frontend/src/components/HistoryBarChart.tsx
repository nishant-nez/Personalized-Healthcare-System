import { Bar, BarChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { IHistoryStats } from "@/interfaces/IHistoryStats"


const chartConfig = {
    missed: {
        label: "Missed",
        color: "hsl(var(--chart-1))",
    },
    taken: {
        label: "Taken",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const HistoryBarChart = ({ stats }: { stats: IHistoryStats }) => {
    const chartData = stats.by_month

    return (
        <Card className="flex flex-col md:max-h-[50vh] mb-4">
            <CardHeader className="items-center">
                <CardTitle>Reminder Status by Month</CardTitle>
                <CardDescription>
                    All Time
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="max-h-[300px]"
                >
                    <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                            dataKey="month_year"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <Bar
                            dataKey="missed"
                            stackId="a"
                            fill="var(--color-missed)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="taken"
                            stackId="a"
                            fill="var(--color-taken)"
                            radius={[4, 4, 0, 0]}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                            cursor={false}
                            defaultIndex={1}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default HistoryBarChart;
