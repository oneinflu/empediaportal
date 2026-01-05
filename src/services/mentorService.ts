import api from './api';
import { Job } from './jobService';
import { Internship } from './internshipService';
import { Course } from './courseService';

export interface Mentor {
  id?: string;
  _id?: string;
  user_id?: string;
  fullName: string;
  profilePhoto?: string;
  coverImage?: string;
  headline?: string;
  yearsOfExperience?: string;
  currentRole?: string;
  company?: string;
  linkedinUrl?: string;
  bio?: string;
  expertiseTags?: string[];
  primaryDomain?: string;
  subSkills?: string[];
  mentorshipTypes?: string[];
  mentorshipFormats?: string[];
  durationOptions?: string[];
  pricingType?: 'Free' | 'Paid';
  pricingAmount?: number;
  revenueShare?: boolean;
  minSkills?: string[];
  courseCompletion?: string;
  internshipExperience?: string;
  weeklySlots?: number;
  maxMentees?: number;
  isPaused?: boolean;
  status?: string;
  pastMenteesCount?: number;
  rating?: number;
  hourlyRate?: number;
  availability?: string;
  isVerified?: boolean;
  recommendedCourses?: Course[];
  recommendedJobs?: Job[];
  recommendedInternships?: Internship[];
}

export const mentorService = {
  getAllMentors: async () => {
    const response = await api.get('/mentors');
    return response.data;
  },

  getMentorById: async (id: string) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },

  createMentor: async (mentorData: FormData) => {
    const response = await api.post('/mentors', mentorData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMentor: async (id: string, mentorData: FormData) => {
    const response = await api.put(`/mentors/${id}`, mentorData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMentor: async (id: string) => {
    const response = await api.delete(`/mentors/${id}`);
    return response.data;
  },
};
