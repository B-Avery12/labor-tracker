import express from "express";
import controller from '../controllers/locations.controller.js';

const router = express.Router();
const locController = new controller();

router.post("/", locController.getLocationCost);

export default router;