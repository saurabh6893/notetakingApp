import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", tasksRouter);

app.get("/", (_req, res) => {
  res.send("Task Manager API is running");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
