export type SortBy = "salary" | "fullName" | "hireDate";
export type SortOrder = "asc" | "desc";

export interface EmployeeFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  country?: string;
  department?: string;
  jobTitle?: string;
  employmentType?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface CreateEmployee {
  fullName: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency?: string;
  email: string;
  employmentType: string;
  hireDate?: string | Date;
}

export interface EmployeeResponse {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency?: string;
  employmentType: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateEmployee = Partial<CreateEmployee>;

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CountryInsight {
  country: string;
  employeeCount: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  totalPayroll: number;
}

export interface DepartmentInsight {
  department: string;
  employeeCount: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
  totalPayroll: number;
}

export interface JobTitleInsight {
  jobTitle: string;
  country: string;
  employeeCount: number;
  avgSalary: number;
  minSalary: number;
  maxSalary: number;
}

export interface SalaryBand {
  band: string;
  count: number;
}

export interface SalarySummary {
  totalEmployees: number;
  averageSalary: number;
  medianSalary: number;
  minSalary: number;
  maxSalary: number;
  totalPayroll: number;
}
