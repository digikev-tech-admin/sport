
import { axiosInstance } from "@/config/api";

// Create a event
export const createPackage = async (data: any) => {
    try {
        const response = await axiosInstance.post("/admin/packages", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Package creation failed";
    }
};

// Get all events
export const getAllPackages = async () => {
    try {
        const response = await axiosInstance.get("/packages");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching packages failed";
    }
};

// Get a event by ID
export const getPackageById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/packages/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching package failed";
    }
};

// Update a event
export const updatePackage = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/packages/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating package failed";
    }
};

// Delete a coupon
export const deletePackage = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/packages/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting coach failed";
    }
};
