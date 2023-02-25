const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errorHandler } = require("./middlewares/errorHandler");
const { limiter } = require("./middlewares/limiter");
// const httpLogger = require("./logging/httpLogger");
const Sentry = require("./sentry");

// routes
const user = require("./routes/user.routes");
const blog = require("./routes/blog.routes");

const app = express();

// const sentry = Sentry.Initialize({ app });

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
// app.use(sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
// app.use(sentry.Handlers.tracingHandler());

// // The error handler must be before any other error middleware and after all controllers
// api.use(Sentry.Handlers.errorHandler());

// // Optional fallthrough error handler
// api.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + "\n");
// });

// use cors
app.use(cors());

// parse information from request body
app.use(express.json());

//middelewares
app.use(helmet());
app.use(limiter);
// app.use(httpLogger);

app.use("/", user);
app.use("/api/v1/blog", blog);

// Home Route
app.get("/", (req, res) => {
  return res.status(200).send({
    status: true,
    message: "Welcome to your Blog",
  });
});

// Undefined route
app.get("*", (req, res) => {
  return res.status(404).send({
    status: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
