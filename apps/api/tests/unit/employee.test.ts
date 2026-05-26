import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEmployee } from "@/src/services/employeeService.js";

const createMock = vi.hoisted(() => vi.fn());

vi.mock("@/src/lib/prisma.js", () => ({
  prisma: {
    employee: {
      create: createMock
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
