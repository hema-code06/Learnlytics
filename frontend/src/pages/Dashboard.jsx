import { useEffect, useState } from "react";
import API from "../api";
import DashboardLayout from "../layout/DashboardLayout";
import Card from "../components/ui/Card";
import Heatmap from "../components/Heatmap";
import EntryForm from "../components/EntryForm";
import VelocityChart from "../components/VelocityChart";
import TopicChart from "../components/TopicChart";
import GoalTracker from "../components/GoalTracker";

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
        setTopicData(topicRes.data);
      } catch (err) {
        console.error("Analytics error:", err);
      }
    };

    fetchAnalytics();
  }, [refreshKey]);

  return (
    <DashboardLayout>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Weekly Streak" value={`${streak} weeks`} />
        <MetricCard title="Velocity" value={`${velocity} hrs/week`} />
        <MetricCard title="Consistency" value={`${consistency}%`} />
      </div>

      {/* Goal */}
      <Card title="Monthly Goal">
        <GoalTracker refreshKey={refreshKey} />
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Weekly Learning Trend">
          <VelocityChart data={trendData} />
        </Card>

        <Card title="Topic Breakdown">
          <TopicChart data={topicData} />
        </Card>
      </div>

      {/* Entry Form */}
      <Card title="Add Learning Entry">
        <EntryForm refresh={refresh} />
      </Card>

      {/* Heatmap */}
      <Card title="Learning Activity Heatmap">
        <Heatmap refreshKey={refreshKey} />
      </Card>
    </DashboardLayout>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="text-3xl font-semibold mt-2">{value}</h2>
    </div>
  );
}
