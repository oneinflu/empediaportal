import api from './api';

interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface User {
  _id: string;
  full_name: string;
  email: string;
  phone?: string;
  role?: string;
  profile_photo?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experience_years?: number;
  education_level?: string;
  education?: Education[];
  experiences?: Experience[];
  created_at: string;
}

interface UsersResponse {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export const userService = {
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await api.get<UsersResponse>(`/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
