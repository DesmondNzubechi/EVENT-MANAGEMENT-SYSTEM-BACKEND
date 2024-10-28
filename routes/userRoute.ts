import express from "express";
import { protectedRoute, restrictedRoute } from "../controllers/authController";

import {
  createAUser,
  deleteAUser,
  getAllUser,
  getAUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router
  .route("/createUser")
  .post(protectedRoute, restrictedRoute(["admin"]), createAUser);

router
  .route("/getAUser")
  .get(protectedRoute, restrictedRoute(["admin"]), getAUser);

router
  .route("/getAllUser")
  .get(protectedRoute, restrictedRoute(["admin"]), getAllUser);

router
  .route("/deleteAUser")
  .patch(protectedRoute, restrictedRoute(["admin"]), deleteAUser);

router
  .route("/updateAUser")
  .patch(protectedRoute, restrictedRoute(["admin"]), updateUser);

export default router;
