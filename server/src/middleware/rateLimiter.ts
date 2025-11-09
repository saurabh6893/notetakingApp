import { Request, Response, NextFunction } from "express";
import { authLimiter, taskLimiter } from "../config/security";

export function rateLimitAuth(req: Request, res: Response, next: NextFunction) {
  return authLimiter(req, res, next);
}

export function rateLimitTask(req: Request, res: Response, next: NextFunction) {
  return taskLimiter(req, res, next);
}
