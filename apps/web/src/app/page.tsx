import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import {
  globalSummaryOptions,
  salaryDistributionOptions,
  topEarnersOptions,
  salaryByDepartmentOptions,
  salaryByCountryOptions
} from "@/lib/apis/insights/insights-queries";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SalaryDistribution } from "@/components/salary-distribution";
import { PayrollByDepartment } from "@/components/payroll-by-department";
import { CountryInsights } from "@/components/country-insights";
import { TopEarners } from "@/components/top-earners";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SiteHeader } from "@/components/sidebar/site-header";

import data from "./data.json";

function SalaryDistributionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className='h-5 w-40 bg-muted rounded animate-pulse' />
        <div className='h-4 w-56 bg-muted rounded animate-pulse' />
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <div className='h-4 w-28 bg-muted rounded animate-pulse' />
              <div className='flex-1 h-3 bg-muted rounded animate-pulse' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} data-slot='card' className='flex flex-col gap-6 rounded-xl border py-6 shadow-xs animate-pulse'>
          <div className='px-6 flex flex-col gap-3'>
            <div className='h-4 w-24 bg-muted rounded' />
            <div className='h-8 w-36 bg-muted rounded' />
            <div className='h-5 w-16 bg-muted rounded-full' />
          </div>
          <div className='px-6 flex flex-col gap-1.5'>
            <div className='h-4 w-48 bg-muted rounded' />
            <div className='h-3 w-36 bg-muted rounded' />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Page() {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(globalSummaryOptions()),
    queryClient.prefetchQuery(salaryDistributionOptions()),
    queryClient.prefetchQuery(topEarnersOptions(5)),
    queryClient.prefetchQuery(salaryByDepartmentOptions()),
    queryClient.prefetchQuery(salaryByCountryOptions())
  ]);

  return (
    <>
      <SiteHeader />
      <div className='flex flex-1 flex-col'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <Suspense fallback={<SectionCardsSkeleton />}>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <SectionCards />
              </HydrationBoundary>
            </Suspense>

            <div className='flex md:flex-row flex-col px-4 lg:px-6 gap-4'>
              <div className='w-full'>
                <Suspense fallback={<SalaryDistributionSkeleton />}>
                  <HydrationBoundary state={dehydrate(queryClient)}>
                    <SalaryDistribution />
                  </HydrationBoundary>
                </Suspense>
              </div>
              <div className='w-full'>
                <Suspense fallback={<SalaryDistributionSkeleton />}>
                  <HydrationBoundary state={dehydrate(queryClient)}>
                    <TopEarners />
                  </HydrationBoundary>
                </Suspense>
              </div>
            </div>

            <div className='flex md:flex-row flex-col px-4 lg:px-6 gap-4'>
              <div className='w-full'>
                <Suspense fallback={<SalaryDistributionSkeleton />}>
                  <HydrationBoundary state={dehydrate(queryClient)}>
                    <CountryInsights />
                  </HydrationBoundary>
                </Suspense>
              </div>

              <div className='w-full'>
                <Suspense fallback={<SalaryDistributionSkeleton />}>
                  <HydrationBoundary state={dehydrate(queryClient)}>
                    <PayrollByDepartment />
                  </HydrationBoundary>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
