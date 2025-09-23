import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3002/api',
  baseURL: 'https://api.brandmaratha.store/api',
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    // console.error("❌ Request Error:", err);
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // console.log("📥 Response Received:", response);
    return response;
  },
  (error) => {
    // console.error("❌ Response Error:", error);

    if (error.response && error.response.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/#/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
