import express from "express";
import { protectedRoute } from "../controllers/authController";

import {
  createAUser,
  deleteAUser,
  getAllUser,
  getAUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.route("/createUser").post(createAUser);

router.route("/getAUser").get(getAUser);

router.route("/getAllUser").get(protectedRoute, getAllUser);

router.route("/deleteAUser").patch(deleteAUser);

router.route("/updateAUser").patch(updateUser);

export default router;
