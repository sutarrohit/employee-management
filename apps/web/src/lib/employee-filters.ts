import type { EmployeeFilters, SortBy, SortOrder } from "@/types/api-types";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

const sortableFields = new Set<SortBy>(["salary", "fullName", "hireDate"]);
const sortOrders = new Set<SortOrder>(["asc", "desc"]);

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveNumber(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseEmployeeFilters(
  searchParams?: SearchParamsRecord,
): EmployeeFilters {
  const page = positiveNumber(firstValue(searchParams?.page));
  const pageSize = positiveNumber(firstValue(searchParams?.pageSize));
  const sortBy = firstValue(searchParams?.sortBy);
  const sortOrder = firstValue(searchParams?.sortOrder);

  return {
    page: page ?? 1,
    pageSize: pageSize ?? 20,
    search: firstValue(searchParams?.search) || undefined,
    country: firstValue(searchParams?.country) || undefined,
    department: firstValue(searchParams?.department) || undefined,
    jobTitle: firstValue(searchParams?.jobTitle) || undefined,
    employmentType: firstValue(searchParams?.employmentType) || undefined,
    sortBy:
      sortBy && sortableFields.has(sortBy as SortBy)
        ? (sortBy as SortBy)
        : undefined,
    sortOrder:
      sortOrder && sortOrders.has(sortOrder as SortOrder)
        ? (sortOrder as SortOrder)
        : undefined,
  };
}

export function filtersFromURLSearchParams(
  searchParams: URLSearchParams,
): EmployeeFilters {
  return parseEmployeeFilters(Object.fromEntries(searchParams.entries()));
}
