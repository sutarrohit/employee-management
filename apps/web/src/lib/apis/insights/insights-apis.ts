import { request } from "@/utils/request";

import type {
  JobTitleInsight,
  EmployeeResponse,
  CountryInsight,
  DepartmentInsight,
  SalaryBand,
  SalarySummary,
} from "@/types/api-types";

export async function getSalaryByCountry(): Promise<CountryInsight[]> {
  return request("/insights/salary-by-country");
}

export async function getSalaryByJobTitle(): Promise<JobTitleInsight[]> {
  return request("/insights/salary-by-job-title");
}

export async function getSalaryByDepartment(): Promise<DepartmentInsight[]> {
  return request("/insights/salary-by-department");
}

export async function getSalaryDistribution(): Promise<SalaryBand[]> {
  return request("/insights/salary-distribution");
}

export async function getTopEarners(
  limit?: number,
): Promise<EmployeeResponse[]> {
  const qs = limit ? `?limit=${limit}` : "";
  return request(`/insights/top-earners${qs}`);
}

export async function getGlobalSummary(): Promise<SalarySummary> {
  return request("/insights/global-summary");
}
