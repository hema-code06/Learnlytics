import Heatmap from "../components/Heatmap";
import EntryForm from "../components/EntryForm";
import VelocityChart from "../components/VelocityChart";
import TopicChart from "../components/TopicChart";
import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [streak, setStreak] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [topicData, setTopicData] = useState([]);

  const refresh = () => setRefreshKey((prev) => prev + 1);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [streakRes, velocityRes, consistencyRes, trendRes, topicRes] =
          await Promise.all([
            API.get("/learning/analytics/streak"),
            API.get("/learning/analytics/velocity"),
            API.get("/learning/analytics/consistency"),
            API.get("/learning/analytics/velocity-trend"),
            API.get("/learning/analytics/topic-breakdown"),
          ]);

        setStreak(streakRes.data.weekly_streak);
        setVelocity(velocityRes.data.weekly_average_hours_last_4_weeks);
        setConsistency(consistencyRes.data.consistency_score_percent);
        setTrendData(trendRes.data);
        setTrendData(topicRes.data);
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };

    fetchAnalytics();
  }, [refreshKey]);

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>
      <h1 style={{ marginBottom: "30px" }}> Learning Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <MetricCard title="Weekly Streak" value={`${streak} weeks`} />
        <MetricCard title="Velocity" value={`${velocity} hrs/week`} />
        <MetricCard title="Consistency" value={`${consistency}%`} />
      </div>

      <VelocityChart data={trendData} />
      <TopicChart data={topicData} />

      <div style={{ marginTop: "40px" }}>
        <EntryForm refresh={refresh} />
      </div>

      <div style={{ marginTop: "40px" }}>
        <Heatmap refreshKey={refreshKey} />
      </div>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        background: "#ffffff",
      }}
    >
      <h4 style={{ marginBottom: "10px", color: "#555" }}>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
