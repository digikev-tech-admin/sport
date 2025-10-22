import { axiosInstance } from "@/config/api";

// Create a event
export const createNotification = async (data: any) => {
    try {
        const response = await axiosInstance.post("/notifications", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Notification creation failed";
    }
};

// Get all events
export const getAllNotifications = async () => {
    try {
        const response = await axiosInstance.get("/notifications");
        return response?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching notifications failed";
    }
};


export const getAllNotificationsForAdmin = async () => {
    try {
        const response = await axiosInstance.get(`/notifications/admin/all`);
        // console.log({response});
        return response?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching notifications failed";
    }
};

// Get a event by ID
export const getNotificationById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/notifications/admin/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching notification failed";
    }
};

// Update a event
export const updateNotification = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/notifications/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating notification failed";
    }
};

// Delete a coupon
export const deleteNotification = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/notifications/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting notification failed";
    }
};




export const getUsersByCoachId = async (coachId: string) => {
    try {
        const response = await axiosInstance.get(`/getUserByOrder/coach/${coachId}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching users by coach id failed"; 
    }
};

export const getUsersByEventId = async (eventId: string) => {
    try {
        const response = await axiosInstance.get(`/getUserByOrder/event/${eventId}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching users by event id failed"; 
    }
};


export const getUsersByLocationId = async (locationId: string) => {
    try {
        const response = await axiosInstance.get(`/getUserByOrder/location/${locationId}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching users by location id failed"; 
    }
};

export const getUsersByPackageId = async (packageId: string) => {
    try {
        const response = await axiosInstance.get(`/getUserByOrder/package/${packageId}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching users by package id failed"; 
    }
};
