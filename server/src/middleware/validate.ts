import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate =
  <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "root",
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
