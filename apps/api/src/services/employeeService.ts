import { ApiError } from "@/src/lib/api-error.js";
import { prisma } from "@/src/lib/prisma.js";
import type { Prisma } from "@/prisma/generated/client.js";
import type { CreateEmployee, EmployeeFilters, PaginatedResult, UpdateEmployee } from "@/src/types/types.js";
import { NOT_FOUND } from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_PHRASE } from "stoker/http-status-phrases";

// Creates a new employee record with normalized default values.
export async function createEmployee(data: CreateEmployee) {
  return await prisma.employee.create({
    data: {
      ...data,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      currency: data.currency ?? "USD"
    }
  });
}

// Fetches a single employee by id and throws when no record exists.
export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new ApiError(NOT_FOUND, NOT_FOUND_PHRASE, "Employee not found");
  return employee;
}

// Updates an existing employee after verifying the record exists.
export async function updateEmployee(id: string, data: UpdateEmployee) {
  await getEmployeeById(id);

  return await prisma.employee.update({
    where: { id },
    data: {
      ...data,
      ...(data.hireDate ? { hireDate: new Date(data.hireDate) } : {})
    }
  });
}

// Deletes an employee after verifying the record exists.
export async function deleteEmployee(id: string) {
  await getEmployeeById(id);
  await prisma.employee.delete({ where: { id } });
}

// Normalizes user-entered filter text by trimming and collapsing whitespace.
function normalizeFilterValue(value?: string) {
  const normalized = value?.trim().replace(/\s+/g, " ");
  return normalized ? normalized : undefined;
}

// Builds the Prisma where clause for employee list filtering and search.
function buildEmployeeWhere(filters: EmployeeFilters): Prisma.EmployeeWhereInput {
  const search = normalizeFilterValue(filters.search);
  const country = normalizeFilterValue(filters.country);
  const department = normalizeFilterValue(filters.department);
  const jobTitle = normalizeFilterValue(filters.jobTitle);
  const employmentType = normalizeFilterValue(filters.employmentType);

  return {
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { jobTitle: { contains: search, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(country ? { country: { equals: country, mode: "insensitive" } } : {}),
    ...(department ? { department: { equals: department, mode: "insensitive" } } : {}),
    ...(jobTitle ? { jobTitle: { equals: jobTitle, mode: "insensitive" } } : {}),
    ...(employmentType ? { employmentType: { equals: employmentType, mode: "insensitive" } } : {})
  };
}

// Returns a paginated employee list using the provided filters and sorting.
export async function getEmployees(
  filters: EmployeeFilters
): Promise<PaginatedResult<Awaited<ReturnType<typeof prisma.employee.findMany>>[number]>> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const where = buildEmployeeWhere(filters);

  const [data, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy: {
        [filters.sortBy ?? "fullName"]: filters.sortOrder ?? "asc"
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.employee.count({ where })
  ]);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    }
  };
}
