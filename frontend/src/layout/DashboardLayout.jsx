import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-600 mb-10">
          LearnTrack
        </h2>

        <nav className="space-y-2 text-sm">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </nav>

        <div className="mt-auto">
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 py-2 rounded-xl text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto p-10">
        {children}
      </div>
    </div>
  );
}