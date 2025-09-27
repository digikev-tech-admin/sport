export interface Event {
    id: string;
    title: string;
    imageUrl: string;
    toDate: string;
    fromDate: string;
    location: string;
    interested: number;
    sport: string;
    
  }


  export interface Coach {
    id: string;
    name: string;
    imageUrl: string;
    clubs: string[]; // List of club or gym names
    sports: string[];
    specializations: string[]; // List of specializations
    rating: number;   // e.g., 4.5
    reviews: number;  // e.g., 1872
    isFavorite: boolean; // true if the coach is marked as favorite
    experience?: number;
  }

  export interface Package {
    id: string;
    sport: string;
    level: string;
    clubs: string;
    ageGroup: string;
    startDate: string;
    endDate: string;
    price: string;
    seats: number;
    enrolled: number;
    duration: number;
    locationId?: string;
    coachName: string;
    title: string;
  }
  
  // export interface Package {
  //   id: string;
  //   sport: string;
  //   level: string;
  //   clubs: string;
  //   ageGroup: string;
  //   startDate: string;
  //   time: string;
  //   days: string;
  //   price: string;
  //   placesLeft: number;
  // }


  export interface AdminType {
    id: string;
    _id?: string;
    name: string;
    country: string;
    joinDate: string;
    createdAt?: string;
    role: string;
    avatar: string;
  }


  interface Address {
    addressLine: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

//   export interface User {
//     _id: string;
//     name: string;
//     country: string;
//     email: string;
//     mobileNo: string;
//     address: Address;
//     subscription: string;
//     avatar: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
// }

export interface User {
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
  avatar: string;
  __v: number;
  id: string;
}



export interface UserType {
  id: string;
  name: string;
  country: string;
  joinDate: string;
  subscription: string;
  avatar: string;
}



export interface MetricCardProps {
  title: string;
  value:  number | string;
  icon: React.ReactNode;
}