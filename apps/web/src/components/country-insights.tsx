"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { salaryByCountryOptions } from "@/lib/apis/insights/insights-queries";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CountryInsights() {
  const { data } = useSuspenseQuery(salaryByCountryOptions());

  return (
    <Card className="@container/card h-full flex flex-col">
      <CardHeader>
        <CardTitle>Payroll by Country</CardTitle>
        <CardDescription>Average salary per country</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="space-y-4">
          {data.map((country, index) => (
            <div key={country.country} className="flex items-center gap-3">
              <span className="w-5 text-center text-sm font-medium text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {country.country}
                </p>
                <p className="text-xs text-muted-foreground">
                  {country.employeeCount} employee
                  {country.employeeCount !== 1 ? "s" : ""}
                </p>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 font-mono tabular-nums"
              >
                {formatCurrency(country.avgSalary)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
