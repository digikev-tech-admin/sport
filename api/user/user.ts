import { axiosInstance } from "@/config/api";

export const createUser = async (userData: any) => {
    try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "User creation failed";
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/users");
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching users failed";
    }
};

export const getUserById = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Fetching user failed";
    }
};

export const updateUser = async (userId: string, data: any) => {
    try {
        const response = await axiosInstance.put(`/users/${userId}`, data);
        // const response = await axiosInstance.put(`/updatedetails`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Updating user failed";
    }
};

export const deleteUser = async (userId: string) => {
    try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || "Deleting user failed";
    }
};
