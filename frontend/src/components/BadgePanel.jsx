import Card from "./ui/Card";

export default function BadgePanel({ badges }) {
  return (
    <Card>
      <h2>Achievements</h2>
      <ul>
        {badges.map((badge) => (
          <li key={badge}>{badge}</li>
        ))}
      </ul>
    </Card>
  );
}