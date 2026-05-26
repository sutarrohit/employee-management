import { AppRouteHandler } from "../../lib/types.js";

import * as HttpStatusCodes from "stoker/http-status-codes";
import { createEmployee } from "@/src/services/employeeService.js";
import { createEmployee as createEmployeeRoute } from "./employee.route.js";

export const createNewEmployee: AppRouteHandler<createEmployeeRoute> = async (c) => {
  const data = c.req.valid("json");
  const employee = await createEmployee(data);
  return c.json(employee, HttpStatusCodes.CREATED);
};
