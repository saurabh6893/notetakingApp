import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks";
import authRouter from "./routes/auth";

import { connectDB } from "./db";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.get("/", (_req, res) => {
  res.send("Task Manager API is running with MongoDB!");
});
const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server listening at http://localhost:${port}`);
      console.log(`📊 Database: tasksApp`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
