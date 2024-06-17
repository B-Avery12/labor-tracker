import express from "express";
import workerController from '../controllers/workers.controller.js';

const router = express.Router();
const controller = new workerController();

router.post("/", controller.getWorkerCost);

export default router;