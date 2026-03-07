import { useState, useEffect } from "react";
import API from "../api";
import Card from "./ui/Card";

export default function GoalTracker({ refreshKey }) {
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState({
    target: 0,
    completed: 0,
    percentage: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get("/learning/goal/progress");
        setProgress(res.data);
      } catch (err) {
        console.error("Failed to fetch goal progress", err);
      }
    };

    fetchProgress();
  }, [refreshKey]);

  const saveGoal = async () => {
    if (!goal || isNaN(Number(goal))) {
      alert("Enter valid target hours");
      return;
    }

    try {
      await API.post("/learning/goal", {
        target_hours: Number(goal),
      });

      alert("Goal saved!");
    } catch (err) {
      console.error("Goal save failed", err);
    }
  };

  return (
    <Card title="Monthly Goal">

      <div className="space-y-4">

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Set monthly goal (hours)"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />

          <button
            onClick={saveGoal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            Save
          </button>
        </div>

        <div className="space-y-1 text-sm text-slate-600">
          <p>
            <strong>Target:</strong> {progress.target} hrs
          </p>

          <p>
            <strong>Completed:</strong> {progress.completed} hrs
          </p>

          <p>
            <strong>Progress:</strong> {progress.percentage}%
          </p>
        </div>

        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-3 transition-all"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

      </div>

    </Card>
  );
}