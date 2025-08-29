import { Request, Response, Router } from "express";
import { TaskModel } from "../models/task";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const tasks = await TaskModel.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Task text is required" });
    }
    const task = new TaskModel({ text, userId: req.userId });
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

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Invalid task text" });
    }

    const task = await TaskModel.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { text },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
