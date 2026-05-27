import { queryOptions } from "@tanstack/react-query";
import * as insightsApis from "./insights-apis";

export function salaryByCountryOptions() {
  return queryOptions({
    queryKey: ["insights", "salary-by-country"],
    queryFn: () => insightsApis.getSalaryByCountry(),
    staleTime: 1000 * 60 * 5,
  });
}

export function salaryByJobTitleOptions() {
  return queryOptions({
    queryKey: ["insights", "salary-by-job-title"],
    queryFn: () => insightsApis.getSalaryByJobTitle(),
    staleTime: 1000 * 60 * 5,
  });
}

export function salaryByDepartmentOptions() {
  return queryOptions({
    queryKey: ["insights", "salary-by-department"],
    queryFn: () => insightsApis.getSalaryByDepartment(),
    staleTime: 1000 * 60 * 5,
  });
}

export function salaryDistributionOptions() {
  return queryOptions({
    queryKey: ["insights", "salary-distribution"],
    queryFn: () => insightsApis.getSalaryDistribution(),
    staleTime: 1000 * 60 * 5,
  });
}

export function topEarnersOptions(limit?: number) {
  return queryOptions({
    queryKey: ["insights", "top-earners", limit],
    queryFn: () => insightsApis.getTopEarners(limit),
    staleTime: 1000 * 60 * 5,
  });
}

export function globalSummaryOptions() {
  return queryOptions({
    queryKey: ["insights", "global-summary"],
    queryFn: () => insightsApis.getGlobalSummary(),
    staleTime: 1000 * 60 * 5,
  });
}
