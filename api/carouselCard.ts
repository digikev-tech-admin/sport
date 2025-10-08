import { axiosInstance } from "@/config/api";

// Create a   carousel card
export const createCarouselCard = async (data: any) => {
    try {
        const response = await axiosInstance.post("/carousel", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Carousel card creation failed";
    }
};

// Get all  carousel cards
export const getAllCarouselCards = async () => {
    try {
        const response = await axiosInstance.get("/carousel");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching carousel cards failed";
    }
};

    // Get a   carousel card by ID
export const getCarouselCardById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/carousel/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Fetching carousel card failed";
    }
};

// Update a   carousel card
export const updateCarouselCard = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/carousel/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Updating carousel card failed";
    }
};

// Delete a   carousel card
    export const deleteCarouselCard = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/carousel/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.error || "Deleting carousel card failed";
    }
};
