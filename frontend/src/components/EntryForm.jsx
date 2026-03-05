import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api";
import EntryList from "./EntryList";

export default function EntryForm({
  entries,
  setEntries,
  refresh,
  editingEntry,
  collapsed = false, // always expanded if modal
}) {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when editing an existing entry
  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date.split("T")[0]);
      setHours(String(editingEntry.hours));
      setTopic(editingEntry.topic);
    } else {
      resetForm();
    }
  }, [editingEntry]);

  const validateFields = () => {
    if (!date || !hours || !topic.trim()) {
      toast.error("All fields are required.");
      return false;
    }
    if (isNaN(Number(hours))) {
      toast.error("Hours must be a valid number.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setDate("");
    setHours("");
    setTopic("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const payload = { date, hours: Number(hours), topic: topic.trim() };

    try {
      setLoading(true);

      if (editingEntry) {
        // Edit existing entry
        const res = await API.put(`/learning/${editingEntry.id}`, payload);
        setEntries((prev) =>
          prev.map((e) => (e.id === editingEntry.id ? res.data : e))
        );
        toast.success("Entry updated successfully.");
      } else {
        // Add new entry
        const res = await API.post("/learning/", payload);
        setEntries((prev) => [res.data, ...prev]);
        toast.success("Entry added successfully.");
      }

      resetForm();
      if (refresh) refresh(); // close modal if modal
    } catch (err) {
      console.error("Submit entry error:", err);
      const message =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const uniqueTopics = [...new Set(entries.map((e) => e.topic).filter(Boolean))];

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="input"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
          className="input"
        />
        <input
          list="topics"
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="input"
        />
        <datalist id="topics">
          {uniqueTopics.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading ? (editingEntry ? "Updating..." : "Adding...") : editingEntry ? "Update Entry" : "Add Entry"}
      </button>
    </form>
  );
}