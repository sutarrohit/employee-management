import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { CreateEmployeeSchema, EmployeeSchema } from "../../types/types.js";

export const createEmployee = createRoute({
  tags: ["employee"],
  method: "post",
  path: "/employee",
  request: {
    body: {
      content: {
        "application/json": {   
          schema: CreateEmployeeSchema
        }
      }
    }
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(EmployeeSchema, "Employee created")
  }
});

export type createEmployee = typeof createEmployee;
