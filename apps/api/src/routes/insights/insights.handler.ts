import { AppRouteHandler } from "../../lib/types.js";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {
  getSalaryByCountry,
  getSalaryByDepartment,
  getSalaryByJobTitle,
} from "@/src/services/insights.js";
import {
  getSalaryByCountry as getSalaryByCountryRoute,
  getSalaryByDepartment as getSalaryByDepartmentRoute,
  getSalaryByJobTitle as getSalaryByJobTitleRoute,
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

export const getSalaryByJobTitleHandler: AppRouteHandler<
  getSalaryByJobTitleRoute
> = async (c) => {
  const { country } = c.req.valid("query");
  const insights = await getSalaryByJobTitle(country);
  return c.json(insights, HttpStatusCodes.OK);
};
