// server/controllers/goalController.js
import Goal from "../models/Goal.js";

export const createGoal = async (req, res) => {
  try {
    let { type, target, targetLeft, completed } = req.body;

    // Input validation
    if (targetLeft > target) {
      return res.status(400).json({
        success: false,
        message: "`targetLeft` cannot be greater than `target`.",
      });
    }

    // If goal is completed or progress is 100% or more, set targetLeft to 0
    const progress = target - targetLeft;
    const percentage = (progress / target) * 100;

    if (percentage >= 100 || completed === true) {
      completed = true;
      targetLeft = 0;
    }

    const newGoal = new Goal({ type, target, targetLeft, completed });
    await newGoal.save();
    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// server/controllers/goalController.js

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    let { target, targetLeft, completed } = req.body;

    if (targetLeft > target) {
      return res.status(400).json({
        success: false,
        message: "`targetLeft` cannot be greater than `target`.",
      });
    }

    // If marking as completed, set targetLeft to 0
    if (completed === true) {
      targetLeft = 0;
    }

    // Recalculate progress percentage
    const progress = target - targetLeft;
    const percentage = (progress / target) * 100;

    // Automatically set completed status if percentage >= 100%
    if (percentage >= 100) {
      completed = true;
      targetLeft = 0; // Ensure targetLeft is 0
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { ...req.body, completed, targetLeft },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedGoal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }
    res.status(200).json({ success: true, data: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(id);
    if (!deletedGoal) {
      return res
        .status(404)
        .json({ success: false, message: "Goal not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
