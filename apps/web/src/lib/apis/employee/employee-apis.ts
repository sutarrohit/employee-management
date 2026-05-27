import { request } from "@/utils/request";
import type {
  EmployeeFilters,
  CreateEmployee,
  EmployeeResponse,
  UpdateEmployee,
  PaginatedResult
} from "@employee-management/api";

export async function createEmployee(data: CreateEmployee): Promise<EmployeeResponse> {
  return request("/employee", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getEmployees(filters?: EmployeeFilters): Promise<PaginatedResult<EmployeeResponse>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
  }
  const qs = params.toString();
  return request(`/employee${qs ? `?${qs}` : ""}`);
}

export async function getEmployeeById(id: string): Promise<EmployeeResponse> {
  return request(`/employee/${id}`);
}

export async function updateEmployee(id: string, data: UpdateEmployee): Promise<EmployeeResponse> {
  return request(`/employee/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export async function deleteEmployee(id: string): Promise<void> {
  await request(`/employee/${id}`, { method: "DELETE" });
}
