import { User } from "@/types/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatUserData = (data: User[]): {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  role: 'user' | 'coach' | 'admin';
  sports: string[];
  level: 'daily' | 'weekly' | 'monthly' | 'occasionally';
  createdAt: Date;
  avatar?: string;
  isActive: boolean;
}[] => {
  return data?.map((user) => ({
    id: user._id,
    name: user.name ?? 'N/A',
    email: user.email ?? 'N/A',
    phone: user.phone ?? 'N/A',
    gender: user.gender,
    role: user.role,
    sports: user.sports ?? [],
    level: user.level,
    createdAt: user.createdAt,
    avatar: user.avatar,
    isActive: user.isActive
  }));
};

/**
 * Formats a date string to the format "DD/MM/YYYY HH:mm"
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  //     const hours = date.getHours().toString().padStart(2, '0');
  // const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // return `${day}/${month}/${year} ${hours}:${minutes}`;
  return `${day}/${month}/${year}`;
};


const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
