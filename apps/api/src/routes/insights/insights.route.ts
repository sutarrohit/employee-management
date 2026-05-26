import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { CountryInsightSchema, JobTitleInsightSchema } from "../../types/types.js";

export const getSalaryByCountry = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-by-country",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(CountryInsightSchema), "Get salary insights grouped by country")
  }
});

export const getSalaryByJobTitle = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-by-job-title",
  request: {
    query: z.object({
      country: z.string().optional()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(JobTitleInsightSchema), "Get salary insights grouped by job title")
  }
});

export type getSalaryByJobTitle = typeof getSalaryByJobTitle;
export type getSalaryByCountry = typeof getSalaryByCountry;
