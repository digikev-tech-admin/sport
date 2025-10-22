import { axiosInstance } from "@/config/api";

export const getUserStats = async () => {
    try {
        const response = await axiosInstance.get("/orders");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching user stats failed"; 
    }
};

export const getChartData = async () => {
    try {
        const response = await axiosInstance.get("/user-activity/chart-data");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching chart data failed"; 
    }
};

export const getInActiveUsers = async () => {
    try {
        const response = await axiosInstance.get("/user-activity/inactive-users");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching in active users failed"; 
    }
};
