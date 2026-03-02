import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TopicChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Topic Breakdown</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="topic" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
