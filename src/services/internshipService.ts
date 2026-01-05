/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { Course } from './courseService';
import { Job } from './jobService';
import { Mentor } from './mentorService';

export interface Internship {
  _id?: string;
  title: string;
  company: any;
  internshipType?: string; // e.g., "Summer", "Winter", "Full-time"
  workMode?: string;
  location?: string;
  duration?: string;
  stipend?: string;
  startDate?: string;
  applicationDeadline?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  description?: string;
  responsibilities?: string;
  perks?: string[];
  status?: 'Pending' | 'Approved' | 'Rejected';
  coverImage?: string;
  recommendedCourses?: Course[];
  recommendedJobs?: Job[];
  recommendedMentors?: Mentor[];
  createdAt?: string;
  updatedAt?: string;
}

export const internshipService = {
  getAllInternships: async (page = 1, limit = 10) => {
    const response = await api.get(`/internships?page=${page}&limit=${limit}`);
    return response.data;
  },

  getInternshipById: async (id: string) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },

  createInternship: async (internshipData: FormData) => {
    const response = await api.post('/internships', internshipData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateInternship: async (id: string, internshipData: FormData) => {
    const response = await api.put(`/internships/${id}`, internshipData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteInternship: async (id: string) => {
    const response = await api.delete(`/internships/${id}`);
    return response.data;
  }
};
