import z from "zod";

export const CreateTaskSchema = z.object({
  text: z
    .string()
    .min(3, "Task must be at least 3 characters")
    .max(500, "Task too long")
    .trim()
    .refine((val) => val.length > 0, "Task cannot be empty"),
});
export const UpdateTaskSchema = z.object({
  text: z
    .string()
    .min(3, "Task must be at least 3 characters")
    .max(500, "Task too long")
    .trim()
    .refine((val) => val.length > 0, "Task cannot be empty"),
});
