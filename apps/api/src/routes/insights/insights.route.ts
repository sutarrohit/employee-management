import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { CountryInsightSchema } from "../../types/types.js";

export const getSalaryByCountry = createRoute({
  tags: ["Insights"],
  method: "get",
  path: "/insights/salary-by-country",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(CountryInsightSchema), "Get salary insights grouped by country")
  }
});

export type getSalaryByCountry = typeof getSalaryByCountry;
