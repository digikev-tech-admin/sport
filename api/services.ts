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



export const updateOrder = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/orders/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating order failed";
    }
};


export const getOrdersByUserId = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/orders/user/${userId}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching order by user id failed"; 
    }
};

type RevenueQueryParams = Record<string, string | number | undefined | null>;

const buildQueryString = (params: RevenueQueryParams = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const serialized = query.toString();
    return serialized ? `?${serialized}` : "";
};

export const getRevenueData = async (queryParams?: RevenueQueryParams) => {
    try {
        const queryString = buildQueryString(queryParams);
        const response = await axiosInstance.get(`/dashboard/revenue${queryString}`);
        return response?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching revenue data failed"; 
    }
};