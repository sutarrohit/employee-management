import type { Employee } from "@/prisma/generated/client.js";
import { z } from "@hono/zod-openapi";

export const SortBySchema = z.enum(["salary", "fullName", "hireDate"]);
export type SortBy = z.infer<typeof SortBySchema>;

export const SortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const EmployeeFiltersSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  search: z.string().optional(),
  country: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  employmentType: z.string().optional(),
  sortBy: SortBySchema.optional(),
  sortOrder: SortOrderSchema.optional()
});
export type EmployeeFilters = z.infer<typeof EmployeeFiltersSchema>;

export const CreateEmployeeSchema = z.object({
  fullName: z.string().min(1),
  jobTitle: z.string().min(1),
  department: z.string().min(1),
  country: z.string().min(1),
  salary: z.number().positive(),
  currency: z.string().optional(),
  email: z.email(),
  employmentType: z.string().min(1),
  hireDate: z.string().or(z.date()).optional()
});
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;

export const EmployeeSchema = CreateEmployeeSchema.extend({
  id: z.string().uuid(),
  hireDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type EmployeeResponse = z.infer<typeof EmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>;

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export const SalarySummarySchema = z.object({
  totalEmployees: z.number(),
  averageSalary: z.number(),
  medianSalary: z.number(),
  minSalary: z.number(),
  maxSalary: z.number(),
  totalPayroll: z.number()
});
export type SalarySummary = z.infer<typeof SalarySummarySchema>;

export const CountryInsightSchema = z.object({
  country: z.string(),
  employeeCount: z.number(),
  avgSalary: z.number(),
  minSalary: z.number(),
  maxSalary: z.number(),
  totalPayroll: z.number()
});
export type CountryInsight = z.infer<typeof CountryInsightSchema>;

export const DepartmentInsightSchema = z.object({
  department: z.string(),
  employeeCount: z.number(),
  avgSalary: z.number(),
  minSalary: z.number(),
  maxSalary: z.number(),
  totalPayroll: z.number()
});
export type DepartmentInsight = z.infer<typeof DepartmentInsightSchema>;

export const JobTitleInsightSchema = z.object({
  jobTitle: z.string(),
  country: z.string(),
  employeeCount: z.number(),
  avgSalary: z.number(),
  minSalary: z.number(),
  maxSalary: z.number()
});
export type JobTitleInsight = z.infer<typeof JobTitleInsightSchema>;

export const SalaryBandSchema = z.object({
  band: z.string(),
  count: z.number()
});
export type SalaryBand = z.infer<typeof SalaryBandSchema>;

export type EmployeeRecord = Employee;
