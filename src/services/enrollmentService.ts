import api from './api';

export interface Enrollment {
  _id: string;
  user_id: string;
  course_id: {
    _id: string;
    title: string;
  } | string;
  purchase_status?: 'completed' | 'pending' | 'failed';
  progress_percent?: number;
  completion_status?: 'In Progress' | 'Completed';
  certificate_url?: string;
  transaction_id?: {
    _id: string;
    amount?: number;
    status?: string;
  } | string;
}

export const enrollmentService = {
  getUserEnrollments: async (userId: string) => {
    const response = await api.get(`/enrollments`, { params: { user_id: userId } });
    return response.data as Enrollment[];
  },
  getEnrollmentById: async (id: string) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data as Enrollment;
  },
  getAllEnrollments: async () => {
    const response = await api.get('/enrollments/admin/all');
    return response.data as Enrollment[];
  }
};
