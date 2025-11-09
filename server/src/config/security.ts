import rateLimit from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 5 : 100,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
    retryAfter: 15,
  },
  standardHeaders: true,
  skip: (req) => process.env.SKIP_RATE_LIMIT === "true",
});

export const taskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 500,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
    retryAfter: 15,
  },
  standardHeaders: true,
  skip: (req) => process.env.SKIP_RATE_LIMIT === "true",
});

export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  frameguard: { action: "deny" },
  xssFilter: true,
  noSniff: true,
};

export default {
  authLimiter,
  taskLimiter,
  helmetConfig,
};
