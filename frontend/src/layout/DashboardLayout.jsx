import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, Plus } from "lucide-react";
import EntryForm from "../components/EntryForm";
import API from "../api";

export default function DashboardLayout({ children }) {
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null); // new state for editing

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fetchEntries = async () => {
    try {
      setLoadingEntries(true);
      const res = await API.get("/learning/");
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch entries error:", err);
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Open modal for editing
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">LearnTrack</h2>

        <button
          onClick={() => {
            setEditingEntry(null); // reset editing when adding new
            setShowModal(true);
          }}
          className="mb-6 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          <Plus size={16} /> Add New Entry
        </button>

        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm text-slate-500 mb-2">Your Entries</h3>
          {loadingEntries ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-slate-400">No entries yet</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                  onClick={() => handleEdit(entry)}
                >
                  <div className="flex justify-between">
                    <span>{entry.topic}</span>
                    <span className="text-slate-400">{entry.hours}h</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

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

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-10 relative">
        {children}

        {/* Modal for EntryForm */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>

              <EntryForm
                entries={entries}
                setEntries={setEntries}
                refresh={() => setShowModal(false)}
                editingEntry={editingEntry} // pass the entry to edit
                collapsed={false} // always expanded in modal
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}