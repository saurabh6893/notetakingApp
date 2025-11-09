import { Request, Response, NextFunction } from "express";
import csrf from "csurf";

// so this iz to Initialize csurf protection
// fr double-submit cookie pattern
const csrfProtection = csrf({ cookie: true });

// Middleware to attach CSRF token to response
export function attachCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.csrfToken = req.csrfToken?.();
  next();
}

// Middleware to validate CSRF token (forall basic stuff POST/PUT/PATCH/DELETE)
export function validateCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Skiingp GET requests (safe operations)
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  csrfProtection(req, res, (err: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "CSRF token invalid or missing.",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
    next();
  });
}

export { csrfProtection };
