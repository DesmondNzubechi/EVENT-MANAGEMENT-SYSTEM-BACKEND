import express from "express";
import { protectedRoute } from "../controllers/authController";
import { createEvent } from "../controllers/eventController";

const router = express.Router();

router.route("/createEvent").post(protectedRoute, createEvent);


export default router