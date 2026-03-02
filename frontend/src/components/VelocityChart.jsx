import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function VelocityChart({ data }) {
  return (
    <div
      style={{ width: "100%", height: 300, stroke: "#6366F1", fill: "#6366F1" }}
    >
      <h3>Weekly Learning Velocity</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
