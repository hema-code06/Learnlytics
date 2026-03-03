import Card from "./ui/Card";

export default function ProductivityCard({ data }) {
  return (
    <Card>
      <h2>Productivity Score</h2>
      <h1>{data.productivity_score}</h1>
      <p>{data.label}</p>
    </Card>
  );
}