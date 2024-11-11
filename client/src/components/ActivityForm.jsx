// src/components/ActivityForm.jsx
import { useState, useEffect } from "react";
import { createActivity, updateActivity } from "../services/api";

const ActivityForm = ({
  fetchActivities,
  editingActivity,
  setEditingActivity,
}) => {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingActivity) {
      setType(editingActivity.type);
      setDuration(editingActivity.duration);
      setCaloriesBurned(editingActivity.caloriesBurned);
    } else {
      setType("");
      setDuration("");
      setCaloriesBurned("");
    }
  }, [editingActivity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activityData = {
      type,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
    };

    try {
      if (editingActivity) {
        // Update existing activity
        await updateActivity(editingActivity._id, activityData);
        setEditingActivity(null);
      } else {
        // Create new activity
        await createActivity(activityData);
      }
      fetchActivities();
      setType("");
      setDuration("");
      setCaloriesBurned("");
      setError("");
    } catch (error) {
      console.error("Error submitting activity:", error);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleCancel = () => {
    setEditingActivity(null);
    setType("");
    setDuration("");
    setCaloriesBurned("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">
        {editingActivity ? "Edit Activity" : "Add Activity"}
      </h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Type:
        </label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter activity type"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Duration (in minutes):
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          min="1"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter duration"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Calories Burned:
        </label>
        <input
          type="number"
          value={caloriesBurned}
          onChange={(e) => setCaloriesBurned(e.target.value)}
          required
          min="0"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter calories burned"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingActivity ? "Update" : "Add"}
        </button>
        {editingActivity && (
          <button
            type="button"
            onClick={handleCancel}
            className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default ActivityForm;
