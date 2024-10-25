import express from "express";
import { protectedRoute } from "../controllers/authController";
import {
  createEvent,
  getAllEvent,
  getAllPublishedEvents,
  publishEvent,
  unPublishEvent,
  updateEvent,
} from "../controllers/eventController";
import { uploadImageToMemory } from "../controllers/uploadEventImage";

const router = express.Router();

router.route("/createEvent").post(protectedRoute, uploadImageToMemory, createEvent);

router.route("updateEvenet/:id").patch(protectedRoute, updateEvent);

router.route("/getAllEvent").get(protectedRoute, getAllEvent);

router
  .route("/getAllPublishedEvent")
  .get(protectedRoute, getAllPublishedEvents);

router.route("/publishEvent").patch(protectedRoute, publishEvent);

router.route("/unPublishEvent").patch(protectedRoute, unPublishEvent);

router.route("/deleteEvent/:id").patch(protectedRoute, unPublishEvent);

export default router;
