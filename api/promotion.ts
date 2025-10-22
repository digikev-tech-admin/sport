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





// Create a plan
export const createPlan = async (data: any) => {
    try {
        const response = await axiosInstance.post("/plans", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Plan creation failed";
    }
};

// Get all plans
export const getAllPlans = async () => {
    try {
        const response = await axiosInstance.get("/plans");
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching plans failed";
    }
};

// Get a plan by ID
export const getPlanById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/plans/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching plan failed";
    }
};

// Update a plan
export const updatePlan = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/plans/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating plan failed";
    }
};

// Delete a plan
export const deletePlan = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/plans/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting plan failed";
    }
};



// Create a coupon
export const createCoupon = async (data: any) => {
    try {
        const response = await axiosInstance.post("/admin/coupons", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Coupon creation failed";
    }
};

// Get all coupons
export const getAllCoupons = async () => {
    try {
        const response = await axiosInstance.get("/admin/coupons");
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching coupons failed";
    }
};

// Get a coupon by ID
export const getCouponById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/admin/coupons/${id}`);
        return response?.data?.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching coupon failed";
    }
};

// Update a coupon
export const updateCoupon = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/admin/coupons/${id}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating coupon failed";
    }
};

// Delete a coupon
export const deleteCoupon = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/admin/coupons/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting coupon failed";
    }
};
