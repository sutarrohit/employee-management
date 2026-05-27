import { serve } from "@hono/node-server";

import app from "./app.js";

export type {
  SortBy,
  SortOrder,
  EmployeeFilters,
  CreateEmployee,
  EmployeeResponse,
  UpdateEmployee,
  PaginatedResult,
  SalarySummary,
  CountryInsight,
  DepartmentInsight,
  JobTitleInsight,
  SalaryBand,
} from "./types/types.js";

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 4000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
