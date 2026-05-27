"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { salaryByDepartmentOptions } from "@/lib/apis/insights/insights-queries";
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

const chartConfig = {
  totalPayroll: {
    label: "Total Payroll",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function PayrollByDepartment() {
  const { data } = useSuspenseQuery(salaryByDepartmentOptions());

  return (
    <Card className="@container/card h-full flex flex-col">
      <CardHeader>
        <CardTitle>Payroll by Department</CardTitle>
        <CardDescription>Total payroll per department</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar
              dataKey="totalPayroll"
              fill="var(--color-totalPayroll)"
              radius={[0, 4, 4, 0]}
              barSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
