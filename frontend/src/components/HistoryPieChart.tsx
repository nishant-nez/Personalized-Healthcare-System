import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
    visitors: {
        label: "Visitors",
    },
    missed: {
        label: "Missed",
        color: "hsl(var(--chart-1))",
    },
    taken: {
        label: "Taken",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig


const HistoryPieChart = ({ stats }: { stats: IHistoryStats }) => {
    const chartData = [
        { status: "missed", visitors: stats.reminders_missed, fill: "var(--color-missed)" },
        { status: "taken", visitors: stats.reminders_taken, fill: "var(--color-taken)" },
    ]
    // const totalVisitors = React.useMemo(() => {
    //     return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    // }, [])

    return (
        <Card className="flex flex-col md:max-h-[50vh] mb-4">
            <CardHeader className="items-center pb-0">
                <CardTitle>Medicines Taken on Time vs Missed</CardTitle>
                <CardDescription>{stats.oldest} - {stats.newest}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {stats.total_reminders}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Reminders
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {stats.reminders_last_day} Reminders past 24 hours <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing all of total reminders sent.
                </div>
            </CardFooter>
        </Card>
    );
}

export default HistoryPieChart;