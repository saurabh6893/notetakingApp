import { Request, Response, Router } from "express";
import { TaskModel } from "../models/task";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { CreateTaskSchema, UpdateTaskSchema } from "../schemas/task.schema";

const router = Router();
router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", validate(CreateTaskSchema), async (req: AuthRequest, res) => {
  try {
    const { text, description } = req.body;
    const task = new TaskModel({ text, description, userId: req.userId });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "failed to Create a Task" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

router.put(
  "/:id",
  validate(UpdateTaskSchema),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { text, description } = req.body;
      const task = await TaskModel.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { text, description },
        { new: true },
      );

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  },
);

router.patch("/:id/complete", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findOne({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ error: "Task not Found" });
    }

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle task completion" });
  }
});

export default router;
