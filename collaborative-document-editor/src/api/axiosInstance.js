import axios from "axios";

let isLoading = false;
let forceLoading = false;

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const path = config.path || ""; // Set the dynamic path
    console.log("Path:", path);

    config.url = `${axios.defaults.baseURL}${path}`; // Concatenate baseURL with dynamic path
    console.log(" config.url ", config.url);

    // Add Authorization token dynamically if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Dynamically add other headers or parameters if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Set loading to false when the API call completes
    isLoading = false;
    console.log("Loading ended:", isLoading); // Optional: Debug log
    return response;
  },
  (error) => {
    isLoading = false;
    console.log("Loading error:", isLoading); // Optional: Debug log
    return Promise.reject(error);
  }
);

export const getLoadingState = () => isLoading || forceLoading;

export const setForceLoadingState = (state) => {
  forceLoading = state;
};

export default axiosInstance;
