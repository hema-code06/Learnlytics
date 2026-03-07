import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getTopics = () => API.get("/topics");

export const createTopic = (data) => API.post("/topics", data);

export const deleteTopic = (id) => API.delete(`/topics/${id}`);

export const getSubtopics = (topicId) => API.get(`/subtopics/${topicId}`);

export const createSubtopic = (data) => API.post("/subtopics", data);

export const toggleSubtopic = (id) => API.put(`/subtopics/${id}/toggle`);

export const deleteSubtopic = (id) => API.delete(`/subtopics/${id}`);

export const getProjects = () => API.get("/projects");

export const createProject = (data) => API.post("/projects", data);

export const getEntries = () => API.get("/");

export const createEntry = (data) => API.post("/", data);

export const updateEntry = (id, data) => API.put(`/${id}`, data);

export const deleteEntry = (id) => API.delete(`/${id}`);

export const getDashboardAnalytics = () => API.get("/analytics/dashboard");

export const getStudyTime = (mode) =>
  API.get(`/analytics/study-time?mode=${mode}`);

export const setMonthlyGoal = (target_hours) =>
  API.post("/goal", { target_hours });

export const getGoalProgress = () => API.get("/goal/progress");

export const getBadges = () => API.get("/badges");

export default API;
