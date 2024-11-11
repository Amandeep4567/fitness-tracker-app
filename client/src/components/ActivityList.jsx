// src/components/ActivityList.jsx
import { useState, useEffect } from "react";
import { getActivities, deleteActivity } from "../services/api";
import ActivityForm from "./ActivityForm";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data.data);
      setError("");
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities.");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteActivity(id);
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      setError("Failed to delete activity.");
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold my-4">Activities</h2>
      <ActivityForm
        fetchActivities={fetchActivities}
        editingActivity={editingActivity}
        setEditingActivity={setEditingActivity}
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Type
              </th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Duration (mins)
              </th>
              <th className="py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600">
                Calories Burned
              </th>
              <th className="py-2 px-4 bg-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id} className="border-b">
                <td className="py-2 px-4">{activity.type}</td>
                <td className="py-2 px-4">{activity.duration}</td>
                <td className="py-2 px-4">{activity.caloriesBurned}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityList;
