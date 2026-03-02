import { useState } from "react";
import API from "../api";

export default function EntryForm({ refresh }) {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [topic, setTopic] = useState("");

  const submit = async () => {
    if (!date || !hours || !topic) {
      alert("All fields are required!!");
      return;
    }

    try {
      await API.post("/learning", {
        date: date,
        hours: Number(hours),
        topic: topic,
      });

      setDate("");
      setHours("");
      setTopic("");

      refresh();
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to add entry");
    }
  };

  return (
    <div>
      <h3>Add Entry</h3>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="Number"
        step="0.1"
        placeholder="Hours"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <input
        type="Topic"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={submit}>Add</button>
    </div>
  );
}
