import { useEffect, useState } from "react";
import API from "../api";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function Heatmap({ refreshKey }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await API.get("/learning/heatmap");
        const formatted = res.data.map((item) => ({
          date: item.date,
          count: item.total_hours,
        }));
        setData(formatted);
      } catch (err) {
        console.log("Heatmap fetch error:", err);
      }
    };
    fetchHeatmap();
  }, [refreshKey]);

  return (
    <div>
      <h3>Learning Heatmap</h3>
      <CalendarHeatmap
        startDate={new Date("2026-01-01")}
        endDate={new Date()}
        values={data}
        classForValue={(value) => {
          if (!value) return "color-empty";
          if (value.count > 5) return "color-github-4";
          if (value.count > 3) return "color-github-3";
          if (value.count > 1) return "color-github-2";
          return "color-github-1";
        }}
      />
    </div>
  );
}
