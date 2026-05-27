import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { EmployeeFilters } from "@/components/employees/employee-filters";
import { EmployeeTable } from "@/components/employees/employee-table";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { employeeListOptions } from "@/lib/apis/employee/employee-queries";
import { parseEmployeeFilters } from "@/lib/employee-filters";
import { getQueryClient } from "@/lib/getQueryClient";

type EmployeesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function EmployeeTableSkeleton() {
  return (
    <Card className='mx-4 lg:mx-6'>
      <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <div className='h-5 w-44 animate-pulse rounded bg-muted' />
          <div className='h-4 w-32 animate-pulse rounded bg-muted' />
        </div>
        <div className='h-8 w-36 animate-pulse rounded bg-muted' />
      </CardHeader>
      <CardContent className='space-y-3'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className='h-10 animate-pulse rounded bg-muted' />
        ))}
      </CardContent>
    </Card>
  );
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseEmployeeFilters(resolvedSearchParams);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(employeeListOptions(filters));

  return (
    <>
      <SiteHeader title='Employees' />
      <div className='flex flex-1 flex-col px-4 lg:px-6'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <EmployeeFilters />
            <Suspense fallback={<EmployeeTableSkeleton />}>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <EmployeeTable />
              </HydrationBoundary>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
