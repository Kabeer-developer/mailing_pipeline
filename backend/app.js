import express from "express";
import cors from "cors";

import pipelineRoutes from "./src/routes/pipelineRoutes.js";

const app = express();
app.use(express.json());

app.use(cors());


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pipeline API Running"
  });
});

app.use("/api/pipeline", pipelineRoutes);

export default app;