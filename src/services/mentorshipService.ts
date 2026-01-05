import api from './api';

export interface MentorshipProgram {
  _id: string;
  mentor: {
    _id: string;
    fullName: string;
    profilePhoto: string;
    headline: string;
  };
  title: string;
  description: string;
  programImage?: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  availableSlots: {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
  }[];
}

export interface Booking {
  _id: string;
  user: string;
  mentor: {
    _id: string;
    fullName: string;
  };
  mentorship: {
    _id: string;
    title: string;
  };
  slot_date: string;
  slot_time: string;
  status: string;
  meeting_link?: string;
}

export const mentorshipService = {
  getProgramsByMentor: async (mentorId: string) => {
    const response = await api.get(`/mentorships?mentor_id=${mentorId}`);
    return response.data;
  },

  getProgramById: async (id: string) => {
    const response = await api.get(`/mentorships/${id}`);
    return response.data;
  },

  bookSlot: async (mentorshipId: string, slotId: string, userNotes: string) => {
    const response = await api.post('/mentorships/book', {
      mentorship_id: mentorshipId,
      slot_id: slotId,
      user_notes: userNotes,
    });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/mentorships/user/my-bookings');
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/mentorships/booking/${id}`);
    return response.data;
  },

  createProgram: async (data: FormData) => {
    const response = await api.post('/mentorships/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  addSlots: async (programId: string, slots: { date: string; startTime: string; endTime: string }[]) => {
    const response = await api.post(`/mentorships/${programId}/slots`, { slots });
    return response.data;
  }
};
