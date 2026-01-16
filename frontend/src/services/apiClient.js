import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const axiosInstance = axios.create({
    baseURL: `${url}/api`,
    withCredentials: true
})
