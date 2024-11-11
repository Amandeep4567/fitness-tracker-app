// server/routes/goalRoutes.js
import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

// Route grouping using router.route()
router.route("/").post(createGoal).get(getGoals);

router.route("/:id").put(updateGoal).delete(deleteGoal);

export default router;
