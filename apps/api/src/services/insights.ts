import { prisma } from "@/src/lib/prisma.js";
import type {
  CountryInsight,
  DepartmentInsight,
  JobTitleInsight,
  SalaryBand,
  SalarySummary
} from "@/src/types/types.js";

export async function getSalaryByCountry(): Promise<CountryInsight[]> {
  const rows = await prisma.employee.groupBy({
    by: ["country"],
    _count: { _all: true },
    _avg: { salary: true },
    _min: { salary: true },
    _max: { salary: true },
    _sum: { salary: true },
    orderBy: { country: "asc" }
  });

  return rows.map((row) => ({
    country: row.country,
    employeeCount: row._count._all,
    avgSalary: Number(row._avg.salary ?? 0),
    minSalary: Number(row._min.salary ?? 0),
    maxSalary: Number(row._max.salary ?? 0),
    totalPayroll: Number(row._sum.salary ?? 0)
  }));
}
