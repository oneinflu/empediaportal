/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { Course } from './courseService';
import { Internship } from './internshipService';
import { Mentor } from './mentorService';

export interface Company {
  _id?: string;
  company_name: string;
  // Add other company fields as needed
}

export interface Job {
  _id?: string;
  title: string;
  company: Company | string; 
  jobType?: string;
  workMode?: string;
  location?: string;
  experienceLevel?: string[];
  shortSummary?: string;
  roleRationale?: string;
  companyProblem?: string;
  roleImpact?: string;
  requiredSkills?: string[];
  niceToHaveSkills?: string[];
  education?: string;
  responsibilities?: string;
  salaryMin?: string;
  salaryMax?: string;
  conversionPossible?: string;
  perks?: string[];
  minCourseCompletion?: string;
  internshipExperienceRequired?: string;
  coverImage?: string;
  deadline?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  recommendedCourses?: Course[];
  recommendedInternships?: Internship[];
  recommendedMentors?: Mentor[];
  createdAt?: string;
  updatedAt?: string;
}

export const jobService = {
  getAllJobs: async (page = 1, limit = 10) => {
    const response = await api.get(`/jobs?page=${page}&limit=${limit}`);
    return response.data;
  },

  getJobById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData: FormData) => {
    const response = await api.post('/jobs', jobData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateJob: async (id: string, jobData: FormData) => {
    const response = await api.put(`/jobs/${id}`, jobData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
};
