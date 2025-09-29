import z from "zod";
//this si for Main Task schema with valdation rules

export const TaskSchema = z.object({
  _id: z.string().min(1, "Task Id is required"),
  text: z
    .string()
    .min(3, "Task title must ne atleast 3 cahracters")
    .max(500, "Task title cannot exceed 500 characters")
    .trim()
    .refine((val) => val.length > 0, "Task cannot be empty"),
  completed: z.boolean(),
  userId: z.string().min(1, "User ID is required"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

// for Input valdation schemas for diff operations

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

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
