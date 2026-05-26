import { AppRouteHandler } from "../../lib/types.js";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { createEmployee, getEmployeeById, updateEmployee } from "@/src/services/employeeService.js";
import {
  createEmployee as createEmployeeRoute,
  getEmployeeById as getEmployeeByIdRoute,
  updateEmployee as updateEmployeeRoute
} from "./employee.route.js";

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

export const updateEmployeeHandler: AppRouteHandler<updateEmployeeRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const employee = await updateEmployee(id, data);
  return c.json(employee, HttpStatusCodes.OK);
};
