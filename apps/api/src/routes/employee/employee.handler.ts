import { AppRouteHandler } from "../../lib/types.js";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { createEmployee, getEmployeeById } from "@/src/services/employeeService.js";
import { createEmployee as createEmployeeRoute, getEmployeeById as getEmployeeByIdRoute } from "./employee.route.js";

export const createNewEmployeeHandler: AppRouteHandler<createEmployeeRoute> = async (c) => {
  const data = c.req.valid("json");
  const employee = await createEmployee(data);
  return c.json(employee, HttpStatusCodes.CREATED);
};

export const getEmployeeByIdHandler: AppRouteHandler<getEmployeeByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const employee = await getEmployeeById(id);
  return c.json(employee, HttpStatusCodes.OK);
};
