import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSalaryByCountry } from "@/src/services/insights.js";

const groupByMock = vi.hoisted(() => vi.fn());

vi.mock("@/src/lib/prisma.js", () => ({
  prisma: {
    employee: {
      groupBy: groupByMock
    }
  }
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
        _sum: { salary: 150000 }
      },
      {
        country: "United States",
        _count: { _all: 1 },
        _avg: { salary: 120000 },
        _min: { salary: 120000 },
        _max: { salary: 120000 },
        _sum: { salary: 120000 }
      }
    ]);

    const result = await getSalaryByCountry();

    expect(groupByMock).toHaveBeenCalledWith({
      by: ["country"],
      _count: { _all: true },
      _avg: { salary: true },
      _min: { salary: true },
      _max: { salary: true },
      _sum: { salary: true },
      orderBy: { country: "asc" }
    });
    expect(result).toEqual([
      {
        country: "India",
        employeeCount: 2,
        avgSalary: 75000,
        minSalary: 50000,
        maxSalary: 100000,
        totalPayroll: 150000
      },
      {
        country: "United States",
        employeeCount: 1,
        avgSalary: 120000,
        minSalary: 120000,
        maxSalary: 120000,
        totalPayroll: 120000
      }
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
        _sum: { salary: null }
      }
    ]);

    const result = await getSalaryByCountry();

    expect(result).toEqual([
      {
        country: "Japan",
        employeeCount: 0,
        avgSalary: 0,
        minSalary: 0,
        maxSalary: 0,
        totalPayroll: 0
      }
    ]);
  });
});
