import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { CreateEmployeeSchema, EmployeeFiltersSchema, EmployeeSchema, UpdateEmployeeSchema } from "../../types/types.js";

const PaginatedEmployeeSchema = z.object({
  data: z.array(EmployeeSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

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

export const getEmployees = createRoute({
  tags: ["Employee"],
  method: "get",
  path: "/employee",
  request: {
    query: EmployeeFiltersSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(PaginatedEmployeeSchema, "Get employees")
  }
});

export const updateEmployee = createRoute({
  tags: ["Employee"],
  method: "patch",
  path: "/employee/{id}",
  request: {
    params: z.object({
      id: z.string()
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateEmployeeSchema
        }
      }
    }
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(EmployeeSchema, "Employee updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(EmployeeSchema.nullable(), "Not found")
  }
});

export const deleteEmployee = createRoute({
  tags: ["Employee"],
  method: "delete",
  path: "/employee/{id}",
  request: {
    params: z.object({
      id: z.string()
    })
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Employee deleted"
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(EmployeeSchema.nullable(), "Not found")
  }
});

export type createEmployee = typeof createEmployee;
export type getEmployeeById = typeof getEmployeeById;
export type getEmployees = typeof getEmployees;
export type updateEmployee = typeof updateEmployee;
export type deleteEmployee = typeof deleteEmployee;
