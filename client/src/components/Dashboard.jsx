// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { getActivities, getGoals } from "../services/api";
import { Link } from "react-router-dom";

// Import React wrapper components from 'react-chartjs-2'
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Import chart components from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [activitySummary, setActivitySummary] = useState({
    totalActivities: 0,
    totalDuration: 0,
    totalCalories: 0,
  });
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      const activitiesData = response.data.data;
      setActivities(activitiesData);
      calculateActivitySummary(activitiesData);
      setError("");
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError("Failed to fetch activities.");
    }
  };

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

  const calculateActivitySummary = (activitiesData) => {
    const totalActivities = activitiesData.length;
    const totalDuration = activitiesData.reduce(
      (sum, activity) => sum + activity.duration,
      0
    );
    const totalCalories = activitiesData.reduce(
      (sum, activity) => sum + activity.caloriesBurned,
      0
    );
    setActivitySummary({ totalActivities, totalDuration, totalCalories });
  };

  useEffect(() => {
    fetchActivities();
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateGoalProgress = (goal) => {
    const progress = goal.target - goal.targetLeft;
    const percentage = (progress / goal.target) * 100;
    return Math.min(percentage, 100);
  };

  // Prepare data for charts
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const activityDates = sortedActivities.map((activity) =>
    new Date(activity.date).toLocaleDateString()
  );

  const activityDurations = sortedActivities.map(
    (activity) => activity.duration
  );

  const caloriesBurned = sortedActivities.map(
    (activity) => activity.caloriesBurned
  );

  const goalStatuses = goals.reduce(
    (acc, goal) => {
      if (goal.completed) {
        acc.completed += 1;
      } else {
        acc.inProgress += 1;
      }
      return acc;
    },
    { completed: 0, inProgress: 0 }
  );

  // Chart Options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fit container size
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Duration (mins)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fit container size
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Calories Burned",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to fit container size
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // Chart Data
  const lineChartData = {
    labels: activityDates,
    datasets: [
      {
        label: "Activity Duration (mins)",
        data: activityDurations,
        fill: false,
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: activityDates,
    datasets: [
      {
        label: "Calories Burned",
        data: caloriesBurned,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        data: [goalStatuses.completed, goalStatuses.inProgress],
        backgroundColor: ["rgb(34, 197, 94)", "rgb(59, 130, 246)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Dashboard
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Activities</h3>
          <p className="text-4xl font-bold text-blue-500">
            {activitySummary.totalActivities}
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Duration</h3>
          <p className="text-4xl font-bold text-green-500">
            {activitySummary.totalDuration} mins
          </p>
        </div>
        <div className="bg-white shadow-md rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Calories Burned</h3>
          <p className="text-4xl font-bold text-red-500">
            {activitySummary.totalCalories}
          </p>
        </div>
      </div>

      {/* Line Chart - Activity Duration Over Time */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Activity Duration Over Time</h3>
        <div
          className="bg-white shadow-md rounded p-4"
          style={{ height: "300px" }} // Adjust chart height here
        >
          {activities.length > 0 ? (
            <Line data={lineChartData} options={lineChartOptions} />
          ) : (
            <p>No activity data available for the chart.</p>
          )}
        </div>
      </div>

      {/* Bar Chart - Calories Burned */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Calories Burned Over Time</h3>
        <div
          className="bg-white shadow-md rounded p-4"
          style={{ height: "300px" }} // Adjust chart height here
        >
          {activities.length > 0 ? (
            <Bar data={barChartData} options={barChartOptions} />
          ) : (
            <p>No activity data available for the chart.</p>
          )}
        </div>
      </div>

      {/* Doughnut Chart - Goals Completion */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Goals Completion Status</h3>
        <div className="bg-white shadow-md rounded p-4 flex justify-center">
          {goals.length > 0 ? (
            <div className="w-48 h-48">
              {" "}
              {/* Adjust chart size here */}
              <Doughnut
                data={doughnutChartData}
                options={doughnutChartOptions}
              />
            </div>
          ) : (
            <p>No goal data available for the chart.</p>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Recent Activities</h3>
        {activities.length > 0 ? (
          <div className="bg-white shadow-md rounded p-4">
            <ul>
              {activities.slice(0, 5).map((activity) => (
                <li
                  key={activity._id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <div>
                    <p className="font-semibold">{activity.type}</p>
                    <p className="text-sm text-gray-600">
                      {activity.duration} mins | {activity.caloriesBurned}{" "}
                      calories
                    </p>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="text-right mt-4">
              <Link
                to="/activities"
                className="text-blue-500 hover:underline text-sm"
              >
                View All Activities &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <p>No activities found.</p>
        )}
      </div>

      {/* Goals Progress */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">Goals Progress</h3>
        {goals.length > 0 ? (
          <div className="bg-white shadow-md rounded p-4">
            <ul>
              {goals.map((goal) => {
                const percentage = calculateGoalProgress(goal);
                return (
                  <li
                    key={goal._id}
                    className="mb-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{goal.type}</p>
                      <p className="text-sm text-gray-600">
                        {goal.completed ? "Completed" : "In Progress"}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          percentage === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {percentage.toFixed(2)}% completed
                    </p>
                  </li>
                );
              })}
            </ul>
            <div className="text-right mt-4">
              <Link
                to="/goals"
                className="text-blue-500 hover:underline text-sm"
              >
                Manage Goals &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <p>No goals found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
