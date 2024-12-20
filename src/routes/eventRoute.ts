// import express from "express";
// import { protectedRoute, restrictedRoute } from "../controllers/authController";
// import {
//   createEvent,
//   getAllEvent,
//   getAllPublishedEvents,
//   getAllUnPublishedEvents,
//   publishEvent,
//   unPublishEvent,
//   updateEvent,
// } from "../controllers/eventController";
// import { uploadImageToMemory } from "../controllers/uploadEventImage";

// const router = express.Router();

// router
//   .route("/createEvent")
//   .post(
//     protectedRoute,
//     restrictedRoute(["admin", "super-admin"]),
//     uploadImageToMemory,
//     createEvent
//   );

// router
//   .route("updateEvenet/:id")
//   .patch(protectedRoute, restrictedRoute(["admin", "super-admin"]), updateEvent);

// router
//   .route("/getAllEvent")
//   .get(
//     protectedRoute,
//   restrictedRoute(["admin", "super-admin"]),
//     getAllEvent
//   );

// router
//   .route("/getAllPublishedEvent")
//   .get(protectedRoute, getAllPublishedEvents);

// router
//   .route("/getAllUnpublishedEvent")
//   .get(protectedRoute, restrictedRoute(["admin"]), getAllUnPublishedEvents);

// router
//   .route("/publishEvent")
//   .patch(protectedRoute, restrictedRoute(["admin"]), publishEvent);

// router
//   .route("/unPublishEvent")
//   .patch(protectedRoute, restrictedRoute(["admin"]), unPublishEvent);

// router
//   .route("/deleteEvent/:id")
//   .patch(protectedRoute, restrictedRoute(["admin"]), unPublishEvent);

// export default router;

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

/**
 * @swagger
 * /createEvent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Event name
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Event date
 *               location:
 *                 type: string
 *                 description: Event location
 *               isPublished:
 *                 type: boolean
 *                 description: Whether the event is published
 *     responses:
 *       201:
 *         description: Event created successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/createEvent")
  .post(
    protectedRoute,
    restrictedRoute(["admin", "super-admin"]),
    uploadImageToMemory,
    createEvent
  );

/**
 * @swagger
 * /updateEvent/{id}:
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Event ID
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/updateEvent/:id")
  .patch(
    protectedRoute,
    restrictedRoute(["admin", "super-admin"]),
    updateEvent
  );

/**
 * @swagger
 * /getAllEvent:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 *       403:
 *         description: Access forbidden
 */
router
  .route("/getAllEvent")
  .get(protectedRoute, restrictedRoute(["admin", "super-admin"]), getAllEvent);

/**
 * @swagger
 * /getAllPublishedEvent:
 *   get:
 *     summary: Get all published events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of published events
 */
router
  .route("/getAllPublishedEvent")
  .get(protectedRoute, getAllPublishedEvents);

/**
 * @swagger
 * /getAllUnpublishedEvent:
 *   get:
 *     summary: Get all unpublished events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of unpublished events
 *       403:
 *         description: Access forbidden
 */
router
  .route("/getAllUnpublishedEvent")
  .get(protectedRoute, restrictedRoute(["admin"]), getAllUnPublishedEvents);

/**
 * @swagger
 * /publishEvent:
 *   patch:
 *     summary: Publish an event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Event ID
 *     responses:
 *       200:
 *         description: Event published successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/publishEvent")
  .patch(protectedRoute, restrictedRoute(["admin"]), publishEvent);

/**
 * @swagger
 * /unPublishEvent:
 *   patch:
 *     summary: Unpublish an event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Event ID
 *     responses:
 *       200:
 *         description: Event unpublished successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/unPublishEvent")
  .patch(protectedRoute, restrictedRoute(["admin"]), unPublishEvent);

/**
 * @swagger
 * /deleteEvent/{id}:
 *   patch:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Event ID
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       403:
 *         description: Access forbidden
 */
router
  .route("/deleteEvent/:id")
  .patch(protectedRoute, restrictedRoute(["admin"]), unPublishEvent);

export default router;
