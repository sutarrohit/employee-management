import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getSalaryByCountry,
  getSalaryByDepartment,
  getSalaryByJobTitle,
} from "@/src/services/insights.js";

const groupByMock = vi.hoisted(() => vi.fn());

vi.mock("@/src/lib/prisma.js", () => ({
  prisma: {
    employee: {
      groupBy: groupByMock,
    },
  },
}));

describe("getSalaryByCountry service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("groups employees by country and maps salary aggregates", async () => {
    groupByMock.mockResolvedValue([
      {
        country: "India",
        _count: { _all: 2 },
        _avg: { salary: 75000 },
        _min: { salary: 50000 },
        _max: { salary: 100000 },
        _sum: { salary: 150000 },
      },
      {
        country: "United States",
        _count: { _all: 1 },
        _avg: { salary: 120000 },
        _min: { salary: 120000 },
        _max: { salary: 120000 },
        _sum: { salary: 120000 },
      },
    ]);

    const result = await getSalaryByCountry();

    expect(groupByMock).toHaveBeenCalledWith({
      by: ["country"],
      _count: { _all: true },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      _sum: { salary: true },
      orderBy: { country: "asc" },
    });
    expect(result).toEqual([
      {
        country: "India",
        employeeCount: 2,
        avgSalary: 75000,
        minSalary: 50000,
        maxSalary: 100000,
        totalPayroll: 150000,
      },
      {
        country: "United States",
        employeeCount: 1,
        avgSalary: 120000,
        minSalary: 120000,
        maxSalary: 120000,
        totalPayroll: 120000,
      },
    ]);
  });

  it("falls back to zero when salary aggregates are null", async () => {
    groupByMock.mockResolvedValue([
      {
        country: "Japan",
        _count: { _all: 0 },
        _avg: { salary: null },
        _min: { salary: null },
        _max: { salary: null },
        _sum: { salary: null },
      },
    ]);

    const result = await getSalaryByCountry();

    expect(result).toEqual([
      {
        country: "Japan",
        employeeCount: 0,
        avgSalary: 0,
        minSalary: 0,
        maxSalary: 0,
        totalPayroll: 0,
      },
    ]);
  });
});

describe("getSalaryByJobTitle service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("groups employees by job title and country when no filter is provided", async () => {
    groupByMock.mockResolvedValue([
      {
        jobTitle: "Data Analyst",
        country: "India",
        _count: { _all: 2 },
        _avg: { salary: 70000 },
        _min: { salary: 50000 },
        _max: { salary: 90000 },
      },
      {
        jobTitle: "Software Engineer",
        country: "United States",
        _count: { _all: 1 },
        _avg: { salary: 120000 },
        _min: { salary: 120000 },
        _max: { salary: 120000 },
      },
    ]);

    const result = await getSalaryByJobTitle();

    expect(groupByMock).toHaveBeenCalledWith({
      by: ["jobTitle", "country"],
      where: undefined,
      _count: { _all: true },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      orderBy: [{ jobTitle: "asc" }, { country: "asc" }],
    });
    expect(result).toEqual([
      {
        jobTitle: "Data Analyst",
        country: "India",
        employeeCount: 2,
        avgSalary: 70000,
        minSalary: 50000,
        maxSalary: 90000,
      },
      {
        jobTitle: "Software Engineer",
        country: "United States",
        employeeCount: 1,
        avgSalary: 120000,
        minSalary: 120000,
        maxSalary: 120000,
      },
    ]);
  });

  it("applies the optional country filter and falls back to zero for null aggregates", async () => {
    groupByMock.mockResolvedValue([
      {
        jobTitle: "Designer",
        country: "India",
        _count: { _all: 0 },
        _avg: { salary: null },
        _min: { salary: null },
        _max: { salary: null },
      },
    ]);

    const result = await getSalaryByJobTitle("India");

    expect(groupByMock).toHaveBeenCalledWith({
      by: ["jobTitle", "country"],
      where: { country: "India" },
      _count: { _all: true },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      orderBy: [{ jobTitle: "asc" }, { country: "asc" }],
    });
    expect(result).toEqual([
      {
        jobTitle: "Designer",
        country: "India",
        employeeCount: 0,
        avgSalary: 0,
        minSalary: 0,
        maxSalary: 0,
      },
    ]);
  });
});

describe("getSalaryByDepartment service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("groups employees by department and maps salary aggregates", async () => {
    groupByMock.mockResolvedValue([
      {
        department: "Engineering",
        _count: { _all: 3 },
        _avg: { salary: 110000 },
        _min: { salary: 80000 },
        _max: { salary: 150000 },
        _sum: { salary: 330000 },
      },
      {
        department: "Marketing",
        _count: { _all: 2 },
        _avg: { salary: 85000 },
        _min: { salary: 70000 },
        _max: { salary: 100000 },
        _sum: { salary: 170000 },
      },
    ]);

    const result = await getSalaryByDepartment();

    expect(groupByMock).toHaveBeenCalledWith({
      by: ["department"],
      _count: { _all: true },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      _sum: { salary: true },
      orderBy: { department: "asc" },
    });
    expect(result).toEqual([
      {
        department: "Engineering",
        employeeCount: 3,
        avgSalary: 110000,
        minSalary: 80000,
        maxSalary: 150000,
        totalPayroll: 330000,
      },
      {
        department: "Marketing",
        employeeCount: 2,
        avgSalary: 85000,
        minSalary: 70000,
        maxSalary: 100000,
        totalPayroll: 170000,
      },
    ]);
  });

  it("falls back to zero when salary aggregates are null", async () => {
    groupByMock.mockResolvedValue([
      {
        department: "Sales",
        _count: { _all: 0 },
        _avg: { salary: null },
        _min: { salary: null },
        _max: { salary: null },
        _sum: { salary: null },
      },
    ]);

    const result = await getSalaryByDepartment();

    expect(result).toEqual([
      {
        department: "Sales",
        employeeCount: 0,
        avgSalary: 0,
        minSalary: 0,
        maxSalary: 0,
        totalPayroll: 0,
      },
    ]);
  });
});
