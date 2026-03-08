import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/learning",
  headers: {
    "Content-Type": "application/json",
  },
});

//ENTRY
export const getEntries = () => API.get("/");
export const createEntry = (data) => API.post("/", data);

//MONTHLY GOAL
export const setMonthlyGoal = (hours) =>
  API.post("/goal", null, {
    params: { target_hours: hours },
  });
export const getMonthlyGoal = () => API.get("/goal");

//ANALYTICS
export const getDashboard = () => API.get("/analytics/dashboard");

export const getStudyTime = (mode = "daily") =>
  API.get(`/analytics/study-time?mode=${mode}`);

export const getTopicBreakdown = () => API.get("/analytics/topics");

export const getWeeklyPattern = () => API.get("/analytics/pattern");

export const getInsights = () => API.get("/analytics/insights");

export const getAchievements = () => API.get("/analytics/achievements");

export default API;
