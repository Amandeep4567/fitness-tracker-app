// src/components/GoalForm.jsx
import { useState, useEffect } from "react";
import { createGoal, updateGoal } from "../services/api";

const GoalForm = ({ fetchGoals, editingGoal, setEditingGoal }) => {
  const [type, setType] = useState("");
  const [target, setTarget] = useState("");
  const [targetLeft, setTargetLeft] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingGoal) {
      setType(editingGoal.type);
      setTarget(editingGoal.target);
      setTargetLeft(editingGoal.targetLeft);
    } else {
      setType("");
      setTarget("");
      setTargetLeft("");
    }
  }, [editingGoal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalData = {
      type,
      target: Number(target),
      targetLeft: Number(targetLeft),
      // Status is not included; it's handled separately
    };

    try {
      if (goalData.targetLeft > goalData.target) {
        setError("Target Left cannot be greater than Target.");
        return;
      }

      if (editingGoal) {
        await updateGoal(editingGoal._id, goalData);
        setEditingGoal(null);
      } else {
        await createGoal(goalData);
      }
      fetchGoals();
      setType("");
      setTarget("");
      setTargetLeft("");
      setError("");
    } catch (error) {
      console.error("Error submitting goal:", error);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleCancel = () => {
    setEditingGoal(null);
    setType("");
    setTarget("");
    setTargetLeft("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">
        {editingGoal ? "Edit Goal" : "Add Goal"}
      </h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Goal Type:
        </label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter goal type"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Target:
        </label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          required
          min="1"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter target value"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Target Left:
        </label>
        <input
          type="number"
          value={targetLeft}
          onChange={(e) => setTargetLeft(e.target.value)}
          required
          min="0"
          max={target || undefined}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter target left"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingGoal ? "Update" : "Add"}
        </button>
        {editingGoal && (
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

export default GoalForm;
