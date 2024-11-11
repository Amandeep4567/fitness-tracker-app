// server/controllers/activityController.js
import Activity from "../models/Activity.js";

// Create new activity
export const createActivity = async (req, res) => {
  try {
    const { type, duration, caloriesBurned } = req.body;

    // Input validation
    if (!type || !duration || !caloriesBurned) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newActivity = new Activity({ type, duration, caloriesBurned });
    await newActivity.save();
    res.status(201).json({ success: true, data: newActivity });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update an activity
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedActivity = await Activity.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedActivity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    res.status(200).json({ success: true, data: updatedActivity });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedActivity = await Activity.findByIdAndDelete(id);
    if (!deletedActivity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
