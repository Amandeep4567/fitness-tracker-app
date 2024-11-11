// server/routes/index.js
import express from "express";
import activityRoutes from "./activityRoutes.js";
import goalRoutes from "./goalRoutes.js";

const router = express.Router();

router.use("/activities", activityRoutes);
router.use("/goals", goalRoutes);

export default router;
