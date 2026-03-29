"use client";


import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const chartData = [
  { month: "Jan", days: 31, present: 28 },
  { month: "Feb", days: 28, present: 24 },
  { month: "Mar", days: 31, present: 29 },
  { month: "Apr", days: 30, present: 20 },
  { month: "May", days: 31, present: 27 },
  { month: "Jun", days: 30, present: 22 },
  { month: "Jul", days: 31, present: 30 },
  { month: "Aug", days: 31, present: 25 },
  { month: "Sep", days: 30, present: 26 },
  { month: "Oct", days: 31, present: 28 },
  { month: "Nov", days: 30, present: 19 },
  { month: "Dec", days: 31, present: 15 },
];

const chartConfig = {
  present: {
    label: "Present",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
        <CardHeader>
        <CardTitle>Attendence of Student</CardTitle>
        <CardDescription>
          Showing total attendence of the year
        </CardDescription>
      </CardHeader>
    <ChartContainer config={chartConfig} className="h-50 w-full">
      <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
            //   tickLine={false}
              axisLine={false}
              tickMargin={8}
            //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="present"
              type="natural"
              fill="var(--color-present)"
              fillOpacity={0.4}
              stroke="var(--color-present)"
            />
          </AreaChart>
    </ChartContainer>
     <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
