import { createRouter } from "../../lib/create-app.js";

import * as handlers from "./employee.handler.js";
import * as routes from "./employee.route.js";

const employeeRoutes = createRouter().openapi(routes.createEmployee, handlers.createNewEmployee);

export default employeeRoutes;
