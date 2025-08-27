import { Request, Response, Router } from "express";
import { TaskModel } from "../models/task";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const tasks = await TaskModel.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/", async (req: Request<{}, {}, { text: string }>, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "Task text is required" });
    }
    const task = new TaskModel({ text });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "failed to Create a Task" });
  }
});

router.delete("/:id", async (req: Request<{ id: string }>, res) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findByIdAndDelete(id);

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
  async (req: Request<{ id: string }, {}, { text: string }>, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Invalid task text" });
      }

      const task = await TaskModel.findByIdAndUpdate(
        id,
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
  },
);

export default router;
