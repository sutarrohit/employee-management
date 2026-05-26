import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getGlobalSummary,
  getSalaryByCountry,
  getSalaryByDepartment,
  getSalaryDistribution,
  getSalaryByJobTitle,
  getTopEarners,
} from "@/src/services/insights.js";

const groupByMock = vi.hoisted(() => vi.fn());
const findManyMock = vi.hoisted(() => vi.fn());
const aggregateMock = vi.hoisted(() => vi.fn());
const countMock = vi.hoisted(() => vi.fn());

vi.mock("@/src/lib/prisma.js", () => ({
  prisma: {
    employee: {
      groupBy: groupByMock,
      findMany: findManyMock,
      aggregate: aggregateMock,
      count: countMock,
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

describe("getSalaryDistribution service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("distributes salaries into predefined bands", async () => {
    findManyMock.mockResolvedValue([
      { salary: 10000 },
      { salary: 25000 },
      { salary: 35000 },
      { salary: 55000 },
      { salary: 75000 },
      { salary: 110000 },
      { salary: 150000 },
      { salary: 200000 },
    ]);

    const result = await getSalaryDistribution();

    expect(findManyMock).toHaveBeenCalledWith({ select: { salary: true } });
    expect(result).toEqual([
      { band: "0-30k", count: 2 },
      { band: "30k-60k", count: 2 },
      { band: "60k-90k", count: 1 },
      { band: "90k-120k", count: 1 },
      { band: "120k+", count: 2 },
    ]);
  });

  it("returns zero counts for all bands when no employees exist", async () => {
    findManyMock.mockResolvedValue([]);

    const result = await getSalaryDistribution();

    expect(result).toEqual([
      { band: "0-30k", count: 0 },
      { band: "30k-60k", count: 0 },
      { band: "60k-90k", count: 0 },
      { band: "90k-120k", count: 0 },
      { band: "120k+", count: 0 },
    ]);
  });

  it("handles boundary salaries at band edges", async () => {
    findManyMock.mockResolvedValue([
      { salary: 0 },
      { salary: 30000 },
      { salary: 60000 },
      { salary: 90000 },
      { salary: 120000 },
    ]);

    const result = await getSalaryDistribution();

    expect(result).toEqual([
      { band: "0-30k", count: 1 },
      { band: "30k-60k", count: 1 },
      { band: "60k-90k", count: 1 },
      { band: "90k-120k", count: 1 },
      { band: "120k+", count: 1 },
    ]);
  });
});

describe("getTopEarners service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns top earners ordered by salary descending with the given limit", async () => {
    const employees = [
      { id: "1", fullName: "Alice", salary: 200000 },
      { id: "2", fullName: "Bob", salary: 150000 },
      { id: "3", fullName: "Charlie", salary: 120000 },
    ];

    findManyMock.mockResolvedValue(employees);

    const result = await getTopEarners(3);

    expect(findManyMock).toHaveBeenCalledWith({
      orderBy: { salary: "desc" },
      take: 3,
    });
    expect(result).toEqual(employees);
  });

  it("returns empty array when limit is zero", async () => {
    findManyMock.mockResolvedValue([]);

    const result = await getTopEarners(0);

    expect(findManyMock).toHaveBeenCalledWith({
      orderBy: { salary: "desc" },
      take: 0,
    });
    expect(result).toEqual([]);
  });

  it("returns all available employees when limit exceeds total count", async () => {
    const employees = [
      { id: "1", fullName: "Alice", salary: 200000 },
      { id: "2", fullName: "Bob", salary: 150000 },
    ];

    findManyMock.mockResolvedValue(employees);

    const result = await getTopEarners(10);

    expect(findManyMock).toHaveBeenCalledWith({
      orderBy: { salary: "desc" },
      take: 10,
    });
    expect(result).toHaveLength(2);
    expect(result).toEqual(employees);
  });
});

describe("getGlobalSummary service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns global salary summary with aggregates and median", async () => {
    aggregateMock.mockResolvedValue({
      _avg: { salary: 95000 },
      _min: { salary: 50000 },
      _max: { salary: 150000 },
      _sum: { salary: 380000 },
    });
    findManyMock.mockResolvedValue([
      { salary: 50000 },
      { salary: 80000 },
      { salary: 100000 },
      { salary: 150000 },
    ]);
    countMock.mockResolvedValue(4);

    const result = await getGlobalSummary();

    expect(aggregateMock).toHaveBeenCalledWith({
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      _sum: { salary: true },
    });
    expect(findManyMock).toHaveBeenCalledWith({ select: { salary: true } });
    expect(countMock).toHaveBeenCalledWith();
    expect(result).toEqual({
      totalEmployees: 4,
      averageSalary: 95000,
      medianSalary: 90000,
      minSalary: 50000,
      maxSalary: 150000,
      totalPayroll: 380000,
    });
  });

  it("falls back to zero when aggregate values are null", async () => {
    aggregateMock.mockResolvedValue({
      _avg: { salary: null },
      _min: { salary: null },
      _max: { salary: null },
      _sum: { salary: null },
    });
    findManyMock.mockResolvedValue([]);
    countMock.mockResolvedValue(0);

    const result = await getGlobalSummary();

    expect(result).toEqual({
      totalEmployees: 0,
      averageSalary: 0,
      medianSalary: 0,
      minSalary: 0,
      maxSalary: 0,
      totalPayroll: 0,
    });
  });

  it("calculates median correctly for odd number of employees", async () => {
    aggregateMock.mockResolvedValue({
      _avg: { salary: 90000 },
      _min: { salary: 50000 },
      _max: { salary: 150000 },
      _sum: { salary: 270000 },
    });
    findManyMock.mockResolvedValue([
      { salary: 50000 },
      { salary: 100000 },
      { salary: 150000 },
    ]);
    countMock.mockResolvedValue(3);

    const result = await getGlobalSummary();

    expect(result.medianSalary).toBe(100000);
  });
});
