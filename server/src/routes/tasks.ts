import { Request, Response, Router } from "express";
import { Task, tasks } from "../models/task";
import { v4 as uuidv4 } from "uuid";

const router = Router();

router.get("/", (req, res) => {
  res.json(tasks);
});

router.post("/", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invlaid" });
  }

  const newTask: Task = { id: uuidv4(), text };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Tasks not found" });
  }

  const deleted = tasks.splice(index, 1)[0];
  res.json(deleted);
});

router.put(
  "/:id",
  (req: Request<{ id: string }, {}, { text: string }>, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Invalid task text" });
    }

    const task = tasks.find((task) => task.id === id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    task.text = text;
    return res.json(task);
  },
);

export default router;
