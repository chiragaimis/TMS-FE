import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const studentApi = {
  getAll: () => api.get('/students'),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

export const teacherApi = {
  getAll: () => api.get('/teachers'),
  getById: (id: string) => api.get(`/teachers/${id}`),
  create: (data: any) => api.post('/teachers', data),
  update: (id: string, data: any) => api.put(`/teachers/${id}`, data),
  delete: (id: string) => api.delete(`/teachers/${id}`),
};

export const batchApi = {
  getAll: () => api.get('/batches'),
  getById: (id: string) => api.get(`/batches/${id}`),
  create: (data: any) => api.post('/batches', data),
  update: (id: string, data: any) => api.put(`/batches/${id}`, data),
  delete: (id: string) => api.delete(`/batches/${id}`),
};

export const attendanceApi = {
  getAll: () => api.get('/attendance'),
  markAttendance: (data: any) => api.post('/attendance', data),
  getByBatch: (batchId: string, date: string) => api.get(`/attendance/batch/${batchId}?date=${date}`),
};

export const feeApi = {
  getAll: () => api.get('/fees'),
  collectFee: (data: any) => api.post('/fees/collect', data),
  getPending: () => api.get('/fees/pending'),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
};

export default api;
