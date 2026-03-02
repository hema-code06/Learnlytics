import { useState } from "react";
import API from "../api";

export default function EntryForm({ refresh }) {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
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
      alert("✅ Entry added successfully..");

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
    <div style={{ marginBottom: "20px" }}>
      <h3>Add Learning Entry</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button onClick={submit} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
