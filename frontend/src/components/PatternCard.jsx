import Card from "./ui/Card";

export default function PatternCard({ pattern }) {
  return (
    <Card>
      <h2>Weekly Pattern</h2>
      <p>Dominant Day: {pattern.dominant_day}</p>
      <p>Type: {pattern.learning_type}</p>
      <p>Consistency: {pattern.consistency_type}</p>
    </Card>
  );
}