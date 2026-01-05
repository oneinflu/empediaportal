import api from './api';
import { companyService, Company } from './companyService';

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: {
      company_name: string;
    } | string;
  };
  user: {
    _id: string;
    full_name: string;
    email: string;
    phone?: string;
    profile_photo?: string;
    resume_url?: string;
  };
  resume_url?: string;
  resume?: string; // Legacy support if needed, but model says resume_url
  status: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected';
  appliedAt: string;
  createdAt?: string; // Backend uses timestamps
  timeline: {
    status: string;
    updatedAt?: string;
    timestamp?: string;
    updatedBy?: string;
    note?: string;
  }[];
}

export const applicationService = {
  applyForJob: async (jobId: string, resumeFile: File) => {
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('resume', resumeFile);
    const response = await api.post('/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  getCompanyApplications: async (companyId: string) => {
    const response = await api.get(`/applications/company/${companyId}`);
    return response.data;
  },
  getAllApplications: async () => {
    const response = await api.get('/admin/applications');
    return response.data;
  },
  getAllApplicationsAggregated: async () => {
    const companies = (await companyService.getAllCompanies()) as Company[];
    const companyIds: string[] = Array.isArray(companies)
      ? companies.map((c) => c._id).filter((id): id is string => typeof id === 'string')
      : [];
    const results = await Promise.all(companyIds.map((id) => api.get(`/applications/company/${id}`)));
    return results.flatMap((r) => (Array.isArray(r.data) ? r.data : []));
  },
  getApplicationById: async (id: string) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  },
};
