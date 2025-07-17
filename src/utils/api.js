import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User registration
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// User login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Submit quiz (✅ FIXED endpoint)
export const submitQuiz = async (quizData) => {
  const response = await api.post("/quiz", quizData); // ✅ changed from /quiz/submit
  return response.data;
};

// Get clothing recommendations
export const getRecommendations = async (userId) => {
  const response = await api.get(`/quiz/user/${userId}/recommendations`);
  return response.data;
};

// Forgot Password
export const forgotPassword = async ({ email }) => {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (err) {
    console.error("Forgot password error:", err);
    return { error: "Failed to connect to server" };
  }
};

// Reset Password
export const resetPassword = async ({ email, answer, newPassword }) => {
  try {
    const response = await api.post("/reset-password", {
      email,
      answer,
      newPassword
    });
    return response.data;
  } catch (err) {
    console.error("Reset password error:", err);
    return { error: "Server error" };
  }
};

