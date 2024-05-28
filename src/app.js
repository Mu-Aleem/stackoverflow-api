import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

import UserRoutes from "./routes/userRoute.js";
import PostRoutes from "./routes/postRoute.js";

dotenv.config({
  path: "./.env",
});

const app = express();

// Middleware

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", UserRoutes);
app.use("/api/posts", PostRoutes);

app.get("/", (req, res) => {
  res.send("Welcome!");
});

// Global error handler
app.use(globalErrorHandler);

export default app;
