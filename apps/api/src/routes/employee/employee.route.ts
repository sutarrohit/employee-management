import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { CreateEmployeeSchema, EmployeeSchema } from "../../types/types.js";

export const createEmployee = createRoute({
  tags: ["Employee"],
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

export const getEmployeeById = createRoute({
  tags: ["Employee"],
  method: "get",
  path: "/employee/{id}",
  request: {
    params: z.object({
      id: z.string()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(EmployeeSchema, "Get employee by id"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(EmployeeSchema.nullable(), "Not found")
  }
});

export type createEmployee = typeof createEmployee;
export type getEmployeeById = typeof getEmployeeById;
