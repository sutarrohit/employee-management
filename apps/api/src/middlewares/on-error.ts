import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { INTERNAL_SERVER_ERROR, OK } from "stoker/http-status-codes";

import env from "../env.js";

const onError: ErrorHandler = (err, c) => {
  const currentStatus = "status" in err ? err.status : c.newResponse(null).status;
  const statusCode = currentStatus !== OK ? (currentStatus as ContentfulStatusCode) : INTERNAL_SERVER_ERROR;
  const errorCode = "code" in err && typeof err.code === "string" ? err.code : "INTERNAL_SERVER_ERROR";

  return c.json(
    {
      statusCode: statusCode,
      code: errorCode,
      message: err.message,
      stack: env.NODE_ENV === "production" ? undefined : err.stack
    },
    statusCode
  );
};

export default onError;
