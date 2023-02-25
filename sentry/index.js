const api = require("@serverless/cloud");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { DSN } = require("../config/config");

const Initialize = ({ app }) => {
  Sentry.init({
    dsn: DSN,
    // or pull from params
    // dsn: params.SENTRY_DSN,
    // environment: params.INSTANCE_NAME,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    // or pull from params
    // tracesSampleRate: parseFloat(params.SENTRY_TRACES_SAMPLE_RATE),
  });

  return Sentry;
};

module.exports = {
  Initialize,
};
