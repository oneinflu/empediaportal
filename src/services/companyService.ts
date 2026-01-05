import api from './api';

export interface Company {
  _id?: string;
  company_name: string;
  industry?: string;
  website?: string;
  logo_url?: string;
  coverImage?: string;
  verified?: boolean;
}

export const companyService = {
  getAllCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },

  getCompanyById: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  createCompany: async (companyData: FormData) => {
    const response = await api.post('/companies', companyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCompany: async (id: string, companyData: FormData) => {
    const response = await api.put(`/companies/${id}`, companyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCompany: async (id: string) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
};
