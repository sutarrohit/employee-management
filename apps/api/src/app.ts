import createApp from "./lib/create-app.js";
import { configureOpenAPI } from "./lib/configure-open-api.js";
import employeeRoutes from "./routes/employee/index.js";
import insightsRoutes from "./routes/insights/index.js";

const app = createApp();
configureOpenAPI(app);

// Mount once with full paths preserved in types
const routes = app.route("/api/v1", employeeRoutes).route("/api/v1", insightsRoutes);

export type AppType = typeof routes;
export default routes;
