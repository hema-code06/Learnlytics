export default function Skeleton({ height = "h-32" }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${height}`} />
  );
}