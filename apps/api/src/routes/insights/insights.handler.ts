import { AppRouteHandler } from "../../lib/types.js";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { getSalaryByCountry } from "@/src/services/insights.js";
import { getSalaryByCountry as getSalaryByCountryRoute } from "./insights.route.js";

export const getSalaryByCountryHandler: AppRouteHandler<getSalaryByCountryRoute> = async (c) => {
  const insights = await getSalaryByCountry();
  return c.json(insights, HttpStatusCodes.OK);
};
