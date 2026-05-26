import createApp from "./lib/create-app.js";
import { configureOpenAPI } from "./lib/configure-open-api.js";

const app = createApp();
configureOpenAPI(app);

app.get("/health", (c) => {
  return c.json({
    status: "ok"
  });
});

export type AppType = typeof app;
export default app;
