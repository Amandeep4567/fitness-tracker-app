// server/models/Activity.js
import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
  type: { type: String, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  caloriesBurned: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
