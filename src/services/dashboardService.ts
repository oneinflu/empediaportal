import api from './api';

export interface DashboardMetricsData {
  activeJobs: number;
  activeInternships: number;
  totalApplications: number;
  courseEnrollments: number;
  mentorBookings: number;
  pendingPayouts: number;
  totalUsers: number;
  totalMentors: number;
  totalCompanies: number;
}

export const dashboardService = {
  getMetrics: async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },
};
