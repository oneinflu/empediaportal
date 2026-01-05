/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import { Job } from './jobService';
import { Internship } from './internshipService';
import { Mentor } from './mentorService';

export interface Course {
  _id?: string;
  title: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  hook?: string;
  category?: string;
  skills?: string[];
  courseType?: string;
  outcomes?: string[];
  opportunities?: string[];
  sections?: any[];
  instructorName?: string;
  instructorBio?: string;
  instructorLinkedin?: string;
  instructorTrustLine?: string;
  instructorCompanyLogos?: string[];
  priceType?: 'Free' | 'Paid';
  priceAmount?: number;
  accessType?: 'Lifetime' | 'Subscription' | 'Limited';
  accessDuration?: number;
  refundPolicy?: string;
  earlyBirdPrice?: number;
  hasStudentDiscount?: boolean;
  hasAssignment?: boolean;
  hasQuiz?: boolean;
  hasProject?: boolean;
  hasCertificate?: boolean;
  thumbnail?: string;
  coverImage?: string;
  completionLogic?: string;
  createdAt?: string;
  updatedAt?: string;
  recommendedJobs?: Job[];
  recommendedInternships?: Internship[];
  recommendedMentors?: Mentor[];
}

export interface Section {
  _id?: string;
  title: string;
  order?: number;
  bunnyPath?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  _id?: string;
  title: string;
  type: 'Video';
  duration?: number;
  isPreviewFree?: boolean;
  videoUrl?: string;
  supportingMaterialType?: string;
  supportingMaterialUrl?: string;
  bunnyPath?: string;
}

export const courseService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourse: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: FormData) => {
    const response = await api.post('/courses', courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCourse: async (id: string, courseData: FormData) => {
    const response = await api.put(`/courses/${id}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  getCurriculum: async (courseId: string) => {
    const response = await api.get<Section[]>(`/courses/${courseId}/curriculum`);
    return response.data;
  },

  addSection: async (courseId: string, title: string) => {
    const response = await api.post<Section>(`/courses/${courseId}/sections`, { title });
    return response.data;
  },

  addLesson: async (courseId: string, sectionId: string, payload: Partial<Lesson>) => {
    const response = await api.post<Lesson>(`/courses/${courseId}/sections/${sectionId}/lessons`, payload);
    return response.data;
  },
};
