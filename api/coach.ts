import { axiosInstance } from "@/config/api";

// Create a event
export const createCoach = async (data: any) => {
    try {
        const response = await axiosInstance.post("/admin/coaches", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Coach creation failed";
    }
};

// Get all events
export const getAllCoaches = async () => {
    try {
        const response = await axiosInstance.get("/coaches");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching coaches failed";
    }
};

// Get a event by ID
export const getCoachById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/coaches/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching coach failed";
    }
};

// Update a event
export const updateCoach = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/coaches/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating coach failed";
    }
};

// Delete a coupon
export const deleteCoach = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/coaches/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting coach failed";
    }
};
