import { axiosInstance } from "@/config/api";

// Create a coupon
export const createLocation = async (data: any) => {
    try {
        const response = await axiosInstance.post("/admin/locations", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Location creation failed";
    }
};

// Get all coupons
export const getAllLocations = async () => {
    try {
        const response = await axiosInstance.get("/locations");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching locations failed";
    }
};

// Get a coupon by ID
export const getLocationById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/locations/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching location failed";
    }
};

// Update a coupon
export const updateLocation = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/locations/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating location failed";
    }
};

// Delete a coupon
export const deleteLocation = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/locations/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting location failed";
    }
};
