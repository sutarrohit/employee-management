import { createRouter } from "../../lib/create-app.js";

import * as handlers from "./insights.handler.js";
import * as routes from "./insights.route.js";

const insightsRoutes = createRouter()
  .openapi(routes.getSalaryByCountry, handlers.getSalaryByCountryHandler)
  .openapi(routes.getSalaryByDepartment, handlers.getSalaryByDepartmentHandler)
  .openapi(routes.getSalaryByJobTitle, handlers.getSalaryByJobTitleHandler);

export default insightsRoutes;
