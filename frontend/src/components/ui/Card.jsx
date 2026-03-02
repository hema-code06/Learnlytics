export default function Card({ title, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition">
      {title && (
        <h3 className="text-lg font-semibold mb-6 text-slate-700">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}