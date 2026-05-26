import createApp from "./lib/create-app.js";
import { configureOpenAPI } from "./lib/configure-open-api.js";
import employeeRoutes from "./routes/employee/index.js";

const app = createApp();
configureOpenAPI(app);

// Mount once with full paths preserved in types
const routes = app.route("/api/v1", employeeRoutes);

export type AppType = typeof routes;
export default routes;
