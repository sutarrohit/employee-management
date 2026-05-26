import { ApiError } from "@/src/lib/api-error.js";
import { prisma } from "@/src/lib/prisma.js";
import type { CreateEmployee, UpdateEmployee } from "@/src/types/types.js";
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
