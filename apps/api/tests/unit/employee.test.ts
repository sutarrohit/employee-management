import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/src/lib/api-error.js";
import { createEmployee, getEmployeeById } from "@/src/services/employeeService.js";
import { NOT_FOUND } from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_PHRASE } from "stoker/http-status-phrases";

const createMock = vi.hoisted(() => vi.fn());
const findUniqueMock = vi.hoisted(() => vi.fn());

vi.mock("@/src/lib/prisma.js", () => ({
  prisma: {
    employee: {
      create: createMock,
      findUnique: findUniqueMock
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
