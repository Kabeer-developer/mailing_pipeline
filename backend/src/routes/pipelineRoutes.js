import express from "express";
import {
  previewPipeline,
  executePipeline
} from "../controllers/pipelineController.js";

const router = express.Router();

router.post("/run", previewPipeline);

router.post("/execute", executePipeline);

export default router;