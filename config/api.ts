import axios from "axios";
import { getToken } from "./token";

export const baseURL = process.env.NEXT_PUBLIC_API_END_POINTS;

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getToken();
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDQxNjhkMWM1YjhmMDM4YjU4YjgzMCIsImlhdCI6MTc0OTI5MjY4NSwiZXhwIjoxNzUxODg0Njg1fQ.KCyP3bGzWWDSPw5jhsT_ISc-qkBFq0UoJrSqKikkFYE";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // CSRF logic commented out
    // if (config.method !== "get") {
    //   const csrfToken = await getCsrfToken();
    //   if (csrfToken) {
    //     config.headers["X-CSRF-Token"] = csrfToken;
    //   }
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// Function to fetch CSRF token (commented out)
// export const getCsrfToken = async () => {
//   try {
//     const response = await axios.get(`${baseURL}/api/csrf-token`, { withCredentials: true });
//     return response.data.csrfToken;
//   } catch (error) {
//     console.error("Failed to fetch CSRF token", error);
//     return null;
//   }
// };
