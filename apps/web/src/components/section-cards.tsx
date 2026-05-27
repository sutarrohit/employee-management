"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { globalSummaryOptions } from "@/lib/apis/insights/insights-queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartUpIcon, ChartDownIcon } from "@hugeicons/core-free-icons";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function SectionCards() {
  const { data } = useSuspenseQuery(globalSummaryOptions());

  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Employees</CardDescription>
          <CardTitle className='min-w-0 truncate text-xl font-semibold tabular-nums @[250px]/card:text-2xl'>
            {formatNumber(data.totalEmployees)}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Growing quarter over quarter <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} className='size-4' />
          </div>
          <div className='text-muted-foreground'>Active headcount company-wide</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Average Salary</CardDescription>
          <CardTitle className='min-w-0 truncate text-xl font-semibold tabular-nums @[250px]/card:text-2xl'>
            {formatCurrency(data.averageSalary)}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Above industry benchmark <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} className='size-4' />
          </div>
          <div className='text-muted-foreground'>Mean compensation per employee</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Payroll</CardDescription>
          <CardTitle className='min-w-0 truncate text-2xl font-semibold tabular-nums @[250px]/card:text-2xl'>
            {formatCurrency(data.totalPayroll)}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Increasing month over month <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} className='size-4' />
          </div>
          <div className='text-muted-foreground'>Total annual compensation cost</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Median Salary</CardDescription>
          <CardTitle className='min-w-0 truncate text-xl font-semibold tabular-nums @[250px]/card:text-2xl'>
            {formatCurrency(data.medianSalary)}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Mid-range salaries rising <HugeiconsIcon icon={ChartUpIcon} strokeWidth={2} className='size-4' />
          </div>
          <div className='text-muted-foreground'>Fiftieth percentile of all salaries</div>
        </CardFooter>
      </Card>
    </div>
  );
}
