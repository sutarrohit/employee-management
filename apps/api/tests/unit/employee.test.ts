import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/src/lib/api-error.js";
import { createEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "@/src/services/employeeService.js";
import { NOT_FOUND } from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_PHRASE } from "stoker/http-status-phrases";

const createMock = vi.hoisted(() => vi.fn());
const findUniqueMock = vi.hoisted(() => vi.fn());
const updateMock = vi.hoisted(() => vi.fn());
const deleteMock = vi.hoisted(() => vi.fn());
const findManyMock = vi.hoisted(() => vi.fn());
const countMock = vi.hoisted(() => vi.fn());

vi.mock("@/src/lib/prisma.js", () => ({
  prisma: {
    employee: {
      create: createMock,
      findUnique: findUniqueMock,
      update: updateMock,
      delete: deleteMock,
      findMany: findManyMock,
      count: countMock
    }
  }
}));

const validPayload = {
  fullName: "Jane Doe",
  jobTitle: "Software Engineer",
  department: "Engineering",
  country: "US",
  salary: 100000,
  email: "jane@example.com",
  employmentType: "Full-time"
};

describe("createEmployee service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls prisma.employee.create with the given data", async () => {
    const returned = {
      id: "abc-123",
      ...validPayload,
      currency: "USD",
      hireDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    createMock.mockResolvedValue(returned);
    const result = await createEmployee(validPayload);

    expect(createMock).toHaveBeenCalledWith({
      data: {
        ...validPayload,
        hireDate: expect.any(Date),
        currency: "USD"
      }
    });
    expect(result).toEqual(returned);
  });


  it("throws error when email already exists (duplicate)", async () => {
    // Prisma throws unique constraint error
    createMock.mockRejectedValue({ code: "P2002", message: "Unique constraint failed" });

    await expect(createEmployee(validPayload)).rejects.toMatchObject({
      code: "P2002"
    });
  });
});

describe("getEmployeeById service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the employee when a matching id exists", async () => {
    const employee = {
      id: "abc-123",
      ...validPayload,
      currency: "USD",
      hireDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    findUniqueMock.mockResolvedValue(employee);

    const result = await getEmployeeById("abc-123");

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "abc-123" }
    });
    expect(result).toEqual(employee);
  });

  it("throws an ApiError when the employee does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(getEmployeeById("missing-id")).rejects.toEqual(
      new ApiError(NOT_FOUND, NOT_FOUND_PHRASE, "Employee not found")
    );
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "missing-id" }
    });
  });
});

describe("updateEmployee service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates an existing employee and converts hireDate to a Date", async () => {
    const existingEmployee = {
      id: "abc-123",
      ...validPayload,
      currency: "USD",
      hireDate: new Date("2024-01-01T00:00:00.000Z"),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatePayload = {
      jobTitle: "Senior Software Engineer",
      hireDate: "2025-01-15T00:00:00.000Z"
    };
    const updatedEmployee = {
      ...existingEmployee,
      ...updatePayload,
      hireDate: new Date(updatePayload.hireDate),
      updatedAt: new Date()
    };

    findUniqueMock.mockResolvedValue(existingEmployee);
    updateMock.mockResolvedValue(updatedEmployee);

    const result = await updateEmployee("abc-123", updatePayload);

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "abc-123" }
    });
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "abc-123" },
      data: {
        ...updatePayload,
        hireDate: new Date(updatePayload.hireDate)
      }
    });
    expect(result).toEqual(updatedEmployee);
  });

  it("throws an ApiError and does not call update when the employee does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(updateEmployee("missing-id", { department: "Product" })).rejects.toEqual(
      new ApiError(NOT_FOUND, NOT_FOUND_PHRASE, "Employee not found")
    );
    expect(updateMock).not.toHaveBeenCalled();
  });
});

describe("deleteEmployee service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes an existing employee by id", async () => {
    const existingEmployee = {
      id: "abc-123",
      ...validPayload,
      currency: "USD",
      hireDate: new Date("2024-01-01T00:00:00.000Z"),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    findUniqueMock.mockResolvedValue(existingEmployee);
    deleteMock.mockResolvedValue(existingEmployee);

    await expect(deleteEmployee("abc-123")).resolves.toBeUndefined();

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "abc-123" }
    });
    expect(deleteMock).toHaveBeenCalledWith({
      where: { id: "abc-123" }
    });
  });

  it("throws an ApiError and does not call delete when the employee does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(deleteEmployee("missing-id")).rejects.toEqual(
      new ApiError(NOT_FOUND, NOT_FOUND_PHRASE, "Employee not found")
    );
    expect(deleteMock).not.toHaveBeenCalled();
  });
});

describe("getEmployees service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns employees with default pagination and sorting", async () => {
    const employees = [
      {
        id: "abc-123",
        ...validPayload,
        currency: "USD",
        hireDate: new Date("2024-01-01T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    findManyMock.mockResolvedValue(employees);
    countMock.mockResolvedValue(1);

    const result = await getEmployees({});

    expect(findManyMock).toHaveBeenCalledWith({
      where: {},
      orderBy: { fullName: "asc" },
      skip: 0,
      take: 20
    });
    expect(countMock).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual({
      data: employees,
      pagination: {
        page: 1,
        pageSize: 20,
        total: 1,
        totalPages: 1
      }
    });
  });

  it("builds filters, applies custom pagination, and calculates total pages", async () => {
    const employees = [
      {
        id: "emp-1",
        ...validPayload,
        fullName: "Jane Doe",
        jobTitle: "Designer",
        department: "Product",
        country: "IN",
        currency: "USD",
        hireDate: new Date("2024-02-01T00:00:00.000Z"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    findManyMock.mockResolvedValue(employees);
    countMock.mockResolvedValue(5);

    const result = await getEmployees({
      page: 2,
      pageSize: 2,
      search: "  Jane  ",
      country: "IN",
      department: "Product",
      jobTitle: "Designer",
      employmentType: "Full-time",
      sortBy: "salary",
      sortOrder: "desc"
    });

    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        OR: [
          { fullName: { contains: "Jane", mode: "insensitive" } },
          { email: { contains: "Jane", mode: "insensitive" } },
          { jobTitle: { contains: "Jane", mode: "insensitive" } }
        ],
        country: { equals: "IN", mode: "insensitive" },
        department: { equals: "Product", mode: "insensitive" },
        jobTitle: { equals: "Designer", mode: "insensitive" },
        employmentType: { equals: "Full-time", mode: "insensitive" }
      },
      orderBy: { salary: "desc" },
      skip: 2,
      take: 2
    });
    expect(countMock).toHaveBeenCalledWith({
      where: {
        OR: [
          { fullName: { contains: "Jane", mode: "insensitive" } },
          { email: { contains: "Jane", mode: "insensitive" } },
          { jobTitle: { contains: "Jane", mode: "insensitive" } }
        ],
        country: { equals: "IN", mode: "insensitive" },
        department: { equals: "Product", mode: "insensitive" },
        jobTitle: { equals: "Designer", mode: "insensitive" },
        employmentType: { equals: "Full-time", mode: "insensitive" }
      }
    });
    expect(result).toEqual({
      data: employees,
      pagination: {
        page: 2,
        pageSize: 2,
        total: 5,
        totalPages: 3
      }
    });
  });

  it("normalizes whitespace and matches filters case-insensitively", async () => {
    findManyMock.mockResolvedValue([]);
    countMock.mockResolvedValue(0);

    await getEmployees({
      search: "  Data     Analyst  ",
      country: "india",
      jobTitle: "Data     Analyst"
    });

    expect(findManyMock).toHaveBeenCalledWith({
      where: {
        OR: [
          { fullName: { contains: "Data Analyst", mode: "insensitive" } },
          { email: { contains: "Data Analyst", mode: "insensitive" } },
          { jobTitle: { contains: "Data Analyst", mode: "insensitive" } }
        ],
        country: { equals: "india", mode: "insensitive" },
        jobTitle: { equals: "Data Analyst", mode: "insensitive" }
      },
      orderBy: { fullName: "asc" },
      skip: 0,
      take: 20
    });
    expect(countMock).toHaveBeenCalledWith({
      where: {
        OR: [
          { fullName: { contains: "Data Analyst", mode: "insensitive" } },
          { email: { contains: "Data Analyst", mode: "insensitive" } },
          { jobTitle: { contains: "Data Analyst", mode: "insensitive" } }
        ],
        country: { equals: "india", mode: "insensitive" },
        jobTitle: { equals: "Data Analyst", mode: "insensitive" }
      }
    });
  });
});
