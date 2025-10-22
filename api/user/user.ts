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



export const registerAdmin = async (adminData: any) => {
    try {
      const response = await axiosInstance.post("/auth/register", adminData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Registration failed";
    }
  };
  
  export const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      return response.data;
    } catch (error: any) {
      console.log(error);
      throw error.response?.data?.error || "Login failed";
    }
  };
  
  export const getAllAdmins = async () => {
    try {
      const response = await axiosInstance.get("/admin");
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "fetching failed";
    }
  };
  
  
  export const getAdminById = async (adminId:string) => {
    try {
      const response = await axiosInstance.get(`/admin/${adminId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "updating failed";
    }
  };
  
  export const updateAdmin = async (adminId: string, data: any) => {
    try {
      const response = await axiosInstance.put(`/admin/${adminId}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Updating failed";
    }
  };
  
  
  export const deleteAdmin = async (adminId: string) => {
    try {
      const response = await axiosInstance.delete(`/admin/${adminId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "Deleted failed";
    }
  };
  
  
  export const forgotPassword = async (email:string) => {
    try {
    const response = await axiosInstance.post('/updatepassword',{email})
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "forget failed";
    }
  };
  
  
  
  export const resetPassword = async (token:string, newPassword:string) => {
    try {
    const response = await axiosInstance.post('/admin/reset-password',{token,newPassword})
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || "reset failed";
    }
  };
  