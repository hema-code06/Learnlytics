import { Link, useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-10">Learning Heatmap</h2>

        <nav className="space-y-3 text-sm">
          <Link className="block text-slate-600 hover:text-primary">
            Dashboard
          </Link>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-sm py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </header>

        <main className="p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}
