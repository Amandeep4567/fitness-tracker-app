// server/routes/activityRoutes.js
import express from "express";
import {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

const router = express.Router();

// Route grouping using router.route()
router.route("/").post(createActivity).get(getActivities);

router.route("/:id").put(updateActivity).delete(deleteActivity);

export default router;
