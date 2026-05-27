import { mutationOptions, queryOptions } from "@tanstack/react-query";
import * as employeeApis from "./employee-apis";
import type {
  CreateEmployee,
  EmployeeFilters,
  UpdateEmployee,
} from "@/types/api-types";

export function employeeListOptions(filters?: EmployeeFilters) {
  return queryOptions({
    queryKey: ["employees", "list", filters],
    queryFn: () => employeeApis.getEmployees(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function employeeDetailOptions(id: string) {
  return queryOptions({
    queryKey: ["employees", "detail", id],
    queryFn: () => employeeApis.getEmployeeById(id),
    staleTime: Infinity,
  });
}

export function createEmployeeMutationOptions() {
  return mutationOptions({
    mutationKey: ["employees", "create"],
    mutationFn: (data: CreateEmployee) => employeeApis.createEmployee(data),
  });
}

export function updateEmployeeMutationOptions() {
  return mutationOptions({
    mutationKey: ["employees", "update"],
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployee }) =>
      employeeApis.updateEmployee(id, data),
  });
}

export function deleteEmployeeMutationOptions() {
  return mutationOptions({
    mutationKey: ["employees", "delete"],
    mutationFn: (id: string) => employeeApis.deleteEmployee(id),
  });
}
