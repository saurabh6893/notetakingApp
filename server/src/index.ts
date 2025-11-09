import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import tasksRouter from "./routes/tasks";
import authRouter from "./routes/auth";

import { connectDB } from "./db";
import { helmetConfig } from "./config/security";
import { rateLimitAuth, rateLimitTask } from "./middleware/rateLimiter";
import { attachCsrfToken, validateCsrfToken } from "./middleware/csrf";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://saurabhsnotetakingapp.netlify.app",
];

app.use(helmet(helmetConfig));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);

app.use(cookieParser());

app.use(express.json());
app.use("/api/auth", rateLimitAuth, attachCsrfToken, authRouter);
app.use("/api/tasks", rateLimitTask, validateCsrfToken, tasksRouter);

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
