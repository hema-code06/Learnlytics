import Card from "./ui/Card";

export default function InsightsPanel({ insights }) {
  return (
    <Card>
      <h2>Smart Insights</h2>
      {insights.map((item) => (
        <div key={item.id}>
          <strong>{item.message}</strong>
          <p>{item.recommendation}</p>
        </div>
      ))}
    </Card>
  );
}