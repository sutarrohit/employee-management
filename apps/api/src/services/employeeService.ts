import { ApiError } from "@/src/lib/api-error.js";
import { prisma } from "@/src/lib/prisma.js";
import type { Prisma } from "@/prisma/generated/client.js";
import type { CreateEmployee, EmployeeFilters, PaginatedResult, UpdateEmployee } from "@/src/types/types.js";
import { NOT_FOUND } from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_PHRASE } from "stoker/http-status-phrases";

export async function createEmployee(data: CreateEmployee) {
  return await prisma.employee.create({
    data: {
      ...data,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      currency: data.currency ?? "USD"
    }
  });
}

export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new ApiError(NOT_FOUND, NOT_FOUND_PHRASE, "Employee not found");
  return employee;
}

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

export async function deleteEmployee(id: string) {
  await getEmployeeById(id);
  await prisma.employee.delete({ where: { id } });
}

function buildEmployeeWhere(filters: EmployeeFilters): Prisma.EmployeeWhereInput {
  const search = filters.search?.trim();

  return {
    ...(search
      ? {
          OR: [{ fullName: { contains: search } }, { email: { contains: search } }, { jobTitle: { contains: search } }]
        }
      : {}),
    ...(filters.country ? { country: filters.country } : {}),
    ...(filters.department ? { department: filters.department } : {}),
    ...(filters.jobTitle ? { jobTitle: filters.jobTitle } : {}),
    ...(filters.employmentType ? { employmentType: filters.employmentType } : {})
  };
}

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
