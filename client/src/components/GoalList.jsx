// src/components/GoalList.jsx
import { useState, useEffect } from "react";
import { getGoals, deleteGoal, updateGoal } from "../services/api";
import GoalForm from "./GoalForm";

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState("");

  const fetchGoals = async () => {
    try {
      const response = await getGoals();
      setGoals(response.data.data);
      setError("");
    } catch (error) {
      console.error("Error fetching goals:", error);
      setError("Failed to fetch goals.");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(id);
        fetchGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
        setError("Failed to delete goal.");
      }
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
  };

  const toggleStatus = async (goal) => {
    try {
      let updatedGoal = { ...goal, completed: !goal.completed };

      if (updatedGoal.completed) {
        // If marking as completed, set targetLeft to 0
        updatedGoal.targetLeft = 0;
      }

      // Send updated goal to backend
      const response = await updateGoal(goal._id, updatedGoal);

      // Update local state with the response data
      setGoals((prevGoals) =>
        prevGoals.map((g) => (g._id === goal._id ? response.data.data : g))
      );
    } catch (error) {
      console.error("Error updating goal status:", error);
      setError("Failed to update goal status.");
    }
  };

  const calculatePercentage = (goal) => {
    const progress = goal.target - goal.targetLeft;
    const percentage = (progress / goal.target) * 100;
    return percentage; // Return the raw percentage
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold my-4">Goals</h2>
      <GoalForm
        fetchGoals={fetchGoals}
        editingGoal={editingGoal}
        setEditingGoal={setEditingGoal}
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Goal Type
              </th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Target
              </th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Target Left
              </th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Progress
              </th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Status
              </th>
              <th className="py-2 px-4 bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => {
              const percentage = calculatePercentage(goal);

              return (
                <tr key={goal._id} className="border-b">
                  <td className="py-2 px-4">{goal.type}</td>
                  <td className="py-2 px-4">{goal.target}</td>
                  <td className="py-2 px-4">
                    {goal.targetLeft !== undefined && goal.targetLeft !== null
                      ? goal.targetLeft
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {percentage.toFixed(2)}% completed
                    </p>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => toggleStatus(goal)}
                      className={`${
                        goal.completed ? "bg-green-500" : "bg-gray-500"
                      } hover:opacity-75 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-sm`}
                    >
                      {goal.completed ? "Completed" : "Incomplete"}
                    </button>
                  </td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoalList;
