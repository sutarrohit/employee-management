import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import {
  CountryInsightSchema,
  DepartmentInsightSchema,
  EmployeeSchema,
  JobTitleInsightSchema,
  SalaryBandSchema,
  SalarySummarySchema,
} from "../../types/types.js";

export const getSalaryByCountry = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-by-country",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(CountryInsightSchema),
      "Get salary insights grouped by country",
    ),
  },
});

export const getSalaryByJobTitle = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-by-job-title",
  request: {
    query: z.object({
      country: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(JobTitleInsightSchema),
      "Get salary insights grouped by job title",
    ),
  },
});

export const getSalaryByDepartment = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-by-department",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(DepartmentInsightSchema),
      "Get salary insights grouped by department",
    ),
  },
});

export const getSalaryDistribution = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-distribution",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(SalaryBandSchema),
      "Get salary distribution across predefined bands",
    ),
  },
});

export const getTopEarners = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/top-earners",
  request: {
    query: z.object({
      limit: z.coerce.number().int().positive(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(EmployeeSchema),
      "Get top earners by salary",
    ),
  },
});

export const getGlobalSummary = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/global-summary",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      SalarySummarySchema,
      "Get global salary summary",
    ),
  },
});

export type getSalaryByJobTitle = typeof getSalaryByJobTitle;
export type getSalaryByCountry = typeof getSalaryByCountry;
export type getSalaryByDepartment = typeof getSalaryByDepartment;
export type getSalaryDistribution = typeof getSalaryDistribution;
export type getTopEarners = typeof getTopEarners;
export type getGlobalSummary = typeof getGlobalSummary;
