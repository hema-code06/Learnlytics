import { useState } from "react";
import { Loader2 } from "lucide-react";
import API from "../api";

export default function EntryForm({ refresh }) {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) {
      alert("Please select a date.");
      return;
    }

    if (!hours || isNaN(Number(hours))) {
      alert("Please enter valid study hours.");
      return;
    }

    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/learning/", {
        date: date,
        hours: Number(hours),
        topic: topic.trim(),
      });
      alert("Entry added successfully..");

      setDate("");
      setHours("");
      setTopic("");

      if (refresh) refresh();
    } catch (err) {
      console.error("Add entry error:", err.response?.data);

      const backendMessage =
        err.response?.data?.detail ||
        "Something went wrong while adding entry.";

      alert(`❌ ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
          />
        </div>

        {/* Hours */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-2">Study Hours</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 2.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
          />
        </div>

        {/* Topic */}
        <div className="flex flex-col">
          <label className="text-sm text-slate-500 mb-2">Topic</label>
          <input
            type="text"
            placeholder="e.g. React Hooks"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Adding Entry..." : "Add Entry"}
        </button>
      </div>
    </form>
  );
}
