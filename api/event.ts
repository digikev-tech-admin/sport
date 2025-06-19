import { axiosInstance } from "@/config/api";

// Create a event
export const createEvent = async (data: any) => {
    try {
        const response = await axiosInstance.post("/admin/events", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Event creation failed";
    }
};

// Get all events
export const getAllEvents = async () => {
    try {
        const response = await axiosInstance.get("/events");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching events failed";
    }
};

// Get a event by ID
export const getEventById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/events/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching event failed";
    }
};

// Update a event
export const updateEvent = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/events/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating event failed";
    }
};

// Delete a coupon
export const deleteEvent = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/events/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting event failed";
    }
};
