export interface IUser {
    _id: string;
    phone: string;
    email: string;
    name: string;
    dob: Date;
    gender: 'male' | 'female' | 'other';
    role: 'user' | 'coach' | 'admin';
    isActive: boolean;
    emergencyContact: string;
    sports: string[];
    level: 'daily' | 'weekly' | 'monthly' | 'occasionally';
    createdAt: Date;
    updatedAt: Date;
    avatar?: string;
    __v: number;
    id: string;
} 