import { getQueryClient } from "@/lib/getQueryClient";
import { employeeDetailOptions } from "@/lib/apis/employee/employee-queries";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { EmployeeDetail } from "@/components/employee/employee-detail";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(employeeDetailOptions(id));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployeeDetail id={id} />
    </HydrationBoundary>
  );
}
