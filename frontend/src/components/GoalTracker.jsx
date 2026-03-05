import { useState, useEffect } from "react";
import API from "../api";

export default function GoalTracker({ refreshKey }) {
  const [goal, setGoal] = useState("");
  const [progress, setProgress] = useState({
    target: 0,
    completed: 0,
    percentage: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await API.get("/learning/goal/progress");
      setProgress(res.data);
    };

    fetchProgress();
  }, [refreshKey]);

  const saveGoal = async () => {
    if (!goal || isNaN(Number(goal))) {
      alert("Enter valid target hours");
      return;
    }

    await API.post("/learning/goal", { target_hours: Number(goal) });

    alert("Goal saved!");
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <h3>Monthly Goal</h3>

      <input
        type="number"
        placeholder="Set monthly goal (hours)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button onClick={saveGoal}>Save Goal</button>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Target:</strong> {progress.target} hrs
        </p>
        <p>
          <strong>Completed:</strong> {progress.completed} hrs
        </p>
        <p>
          <strong>Progress:</strong> {progress.percentage}%
        </p>

        <div
          style={{
            height: "20px",
            background: "#eee",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress.percentage}%`,
              background: "#4caf50",
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
