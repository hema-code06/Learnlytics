export default function Card({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {title && (
        <h3 className="text-sm font-medium text-slate-500 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
