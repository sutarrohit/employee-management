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

export async function getSalaryByJobTitle(country?: string): Promise<JobTitleInsight[]> {
  const rows = await prisma.employee.groupBy({
    by: ["jobTitle", "country"],
    where: country ? { country } : undefined,
    _count: { _all: true },
    _avg: { salary: true },
    _min: { salary: true },
    _max: { salary: true },
    orderBy: [{ jobTitle: "asc" }, { country: "asc" }]
  });

  return rows.map((row) => ({
    jobTitle: row.jobTitle,
    country: row.country,
    employeeCount: row._count._all,
    avgSalary: Number(row._avg.salary ?? 0),
    minSalary: Number(row._min.salary ?? 0),
    maxSalary: Number(row._max.salary ?? 0)
  }));
}

export async function getSalaryByDepartment(): Promise<DepartmentInsight[]> {
  const rows = await prisma.employee.groupBy({
    by: ["department"],
    _count: { _all: true },
    _avg: { salary: true },
    _min: { salary: true },
    _max: { salary: true },
    _sum: { salary: true },
    orderBy: { department: "asc" }
  });

  return rows.map((row) => ({
    department: row.department,
    employeeCount: row._count._all,
    avgSalary: Number(row._avg.salary ?? 0),
    minSalary: Number(row._min.salary ?? 0),
    maxSalary: Number(row._max.salary ?? 0),
    totalPayroll: Number(row._sum.salary ?? 0)
  }));
}

export async function getSalaryDistribution(): Promise<SalaryBand[]> {
  const salaries = await prisma.employee.findMany({
    select: { salary: true }
  });

  const bands = [
    { band: "0-30k", min: 0, max: 30_000, count: 0 },
    { band: "30k-60k", min: 30_000, max: 60_000, count: 0 },
    { band: "60k-90k", min: 60_000, max: 90_000, count: 0 },
    { band: "90k-120k", min: 90_000, max: 120_000, count: 0 },
    { band: "120k+", min: 120_000, max: Number.POSITIVE_INFINITY, count: 0 }
  ];

  for (const { salary } of salaries) {
    const bucket = bands.find((item) => salary >= item.min && salary < item.max);
    if (bucket) {
      bucket.count += 1;
    }
  }

  return bands.map(({ band, count }) => ({ band, count }));
}

export async function getTopEarners(limit: number) {
  return prisma.employee.findMany({
    orderBy: { salary: "desc" },
    take: limit
  });
}
