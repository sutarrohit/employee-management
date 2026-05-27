"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { salaryDistributionOptions } from "@/lib/apis/insights/insights-queries";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Employees",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function SalaryDistribution() {
  const { data } = useSuspenseQuery(salaryDistributionOptions());

  return (
    <Card className="@container/card h-full flex flex-col">
      <CardHeader>
        <CardTitle>Salary Distribution</CardTitle>
        <CardDescription>Number of employees per salary band</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={data}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="band" tickLine={false} axisLine={false} />
            <YAxis type="number" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
