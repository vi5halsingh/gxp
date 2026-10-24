import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import inputRouter from "./routes/input.routes.js";
import profileRouter from "./routes/profile.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/input", inputRouter);
app.use("/api/profile", profileRouter);

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Universal error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;