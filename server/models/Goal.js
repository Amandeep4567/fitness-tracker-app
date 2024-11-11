// server/models/Goal.js
import mongoose from "mongoose";

const goalSchema = mongoose.Schema({
  type: { type: String, required: true },
  target: { type: Number, required: true, min: 1 },
  targetLeft: { type: Number, required: true, min: 0 }, // New field
  date: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
