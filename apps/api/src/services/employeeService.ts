import { prisma } from "@/src/lib/prisma.js";
import type { CreateEmployee } from "@/src/types/types.js";

export async function createEmployee(data: CreateEmployee) {
  return await prisma.employee.create({
    data: {
      ...data,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      currency: data.currency ?? "USD"
    }
  });
}
