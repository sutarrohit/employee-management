import { AppRouteHandler } from "../../lib/types.js";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {
  getGlobalSummary,
  getSalaryByCountry,
  getSalaryByDepartment,
  getSalaryDistribution,
  getSalaryByJobTitle,
  getTopEarners,
} from "@/src/services/insights.js";
import {
  getGlobalSummary as getGlobalSummaryRoute,
  getSalaryByCountry as getSalaryByCountryRoute,
  getSalaryByDepartment as getSalaryByDepartmentRoute,
  getSalaryDistribution as getSalaryDistributionRoute,
  getSalaryByJobTitle as getSalaryByJobTitleRoute,
  getTopEarners as getTopEarnersRoute,
} from "./insights.route.js";

export const getSalaryByCountryHandler: AppRouteHandler<
  getSalaryByCountryRoute
> = async (c) => {
  const insights = await getSalaryByCountry();
  return c.json(insights, HttpStatusCodes.OK);
};

export const getSalaryByDepartmentHandler: AppRouteHandler<
  getSalaryByDepartmentRoute
> = async (c) => {
  const insights = await getSalaryByDepartment();
  return c.json(insights, HttpStatusCodes.OK);
};

export const getSalaryDistributionHandler: AppRouteHandler<
  getSalaryDistributionRoute
> = async (c) => {
  const insights = await getSalaryDistribution();
  return c.json(insights, HttpStatusCodes.OK);
};

export const getTopEarnersHandler: AppRouteHandler<getTopEarnersRoute> = async (
  c,
) => {
  const { limit } = c.req.valid("query");
  const employees = await getTopEarners(limit);
  return c.json(employees, HttpStatusCodes.OK);
};

export const getGlobalSummaryHandler: AppRouteHandler<
  getGlobalSummaryRoute
> = async (c) => {
  const summary = await getGlobalSummary();
  return c.json(summary, HttpStatusCodes.OK);
};

export const getSalaryByJobTitleHandler: AppRouteHandler<
  getSalaryByJobTitleRoute
> = async (c) => {
  const { country } = c.req.valid("query");
  const insights = await getSalaryByJobTitle(country);
  return c.json(insights, HttpStatusCodes.OK);
};
