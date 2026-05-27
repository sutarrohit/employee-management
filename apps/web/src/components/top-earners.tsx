"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { topEarnersOptions } from "@/lib/apis/insights/insights-queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TopEarners() {
  const { data } = useSuspenseQuery(topEarnersOptions(8));

  return (
    <Card className='@container/card h-full'>
      <CardHeader>
        <CardTitle>Top Earners</CardTitle>
        <CardDescription>Highest paid employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {data.map((employee, index) => (
            <div key={employee.id} className='flex items-center gap-3'>
              <span className='w-5 text-center text-sm font-medium text-muted-foreground'>{index + 1}</span>
              <Avatar className='size-8'>
                <AvatarFallback className='text-xs'>{getInitials(employee.fullName)}</AvatarFallback>
              </Avatar>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{employee.fullName}</p>
                <p className='text-xs text-muted-foreground truncate'>{employee.jobTitle}</p>
              </div>
              <Badge variant='outline' className='shrink-0 font-mono tabular-nums'>
                {formatCurrency(employee.salary)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
