import express from "express";
import { protectedRoute, restrictedRoute } from "../controllers/authController";
import {
  createEvent,
  getAllEvent,
  getAllPublishedEvents,
  getAllUnPublishedEvents,
  publishEvent,
  unPublishEvent,
  updateEvent,
} from "../controllers/eventController";
import { uploadImageToMemory } from "../controllers/uploadEventImage";

const router = express.Router();

router
  .route("/createEvent") 
  .post(
    protectedRoute,
    restrictedRoute(["admin", "super-admin"]),
    uploadImageToMemory,
    createEvent
  );

router
  .route("updateEvenet/:id")
  .patch(protectedRoute, restrictedRoute(["admin", "super-admin"]), updateEvent);

router
  .route("/getAllEvent")
  .get(
    // protectedRoute,
    // restrictedRoute(["admin", "super-admin"]),
    getAllEvent
  );

router
  .route("/getAllPublishedEvent")
  .get(protectedRoute, getAllPublishedEvents);

router
  .route("/getAllUnpublishedEvent")
  .get(protectedRoute, restrictedRoute(["admin"]), getAllUnPublishedEvents);

router
  .route("/publishEvent")
  .patch(protectedRoute, restrictedRoute(["admin"]), publishEvent);

router
  .route("/unPublishEvent")
  .patch(protectedRoute, restrictedRoute(["admin"]), unPublishEvent);

router
  .route("/deleteEvent/:id")
  .patch(protectedRoute, restrictedRoute(["admin"]), unPublishEvent);

export default router;
 