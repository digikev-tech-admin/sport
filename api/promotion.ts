import { axiosInstance } from "@/config/api";

// Create a event
export const createPromotion = async (data: any) => {
    try {
        const response = await axiosInstance.post("/promotions", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Promotion creation failed";
    }
};

// Get all events
export const getAllPromotions = async () => {
    try {
        const response = await axiosInstance.get("/promotions");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching promotions failed";
    }
};

// Get a event by ID
export const getPromotionById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/promotions/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching promotion failed";
    }
};

// Update a event
export const updatePromotion = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/promotions/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating promotion failed";
    }
};

// Delete a coupon
export const deletePromotion = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/promotions/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting promotion failed";
    }
};
