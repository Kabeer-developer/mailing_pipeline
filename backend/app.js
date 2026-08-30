import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";

import pipelineRoutes from "./src/routes/pipelineRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pipeline API Running",
  });
});

app.use("/api/pipeline", pipelineRoutes);

export default app;