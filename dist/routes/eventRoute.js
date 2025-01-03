"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const eventController_1 = require("../controllers/eventController");
const uploadEventImage_1 = require("../controllers/uploadEventImage");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/event/createEvent:
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
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin", "super-admin"]), uploadEventImage_1.uploadImageToMemory, eventController_1.createEvent);
/**
 * @swagger
 *  /api/v1/event/updateEvent/{id}:
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
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin", "super-admin"]), eventController_1.updateEvent);
/**
 * @swagger
 *  /api/v1/event/getAllEvent:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *       403:
 *         description: Access forbidden
 */
router
    .route("/getAllEvent")
    .get(eventController_1.getAllEvent);
/**
 * @swagger
 *  /api/v1/event/getAllPublishedEvent:
 *   get:
 *     summary: Get all published events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of published events
 */
router
    .route("/getAllPublishedEvent")
    .get(authController_1.protectedRoute, eventController_1.getAllPublishedEvents);
/**
 * @swagger
 *  /api/v1/event/getAllUnpublishedEvent:
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
    .get(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), eventController_1.getAllUnPublishedEvents);
/**
 * @swagger
 *  /api/v1/event/publishEvent:
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
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), eventController_1.publishEvent);
/**
 * @swagger
 *  /api/v1/event/unPublishEvent:
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
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), eventController_1.unPublishEvent);
/**
 * @swagger
 *  /api/v1/event/deleteEvent/{id}:
 *   patch:
 *     summary: Delete an event (Unpublish it)
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
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), eventController_1.unPublishEvent);
/**
 * @swagger
 *  /api/v1/event/event/{id}:
 *   get:
 *     summary: Get a specific event by ID
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
 *         description: Event details
 *       403:
 *         description: Access forbidden
 */
router.route("/event/:id").get(eventController_1.getAnEvent);
exports.default = router;
