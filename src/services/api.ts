import axios from 'axios';
import config from '../config/global.json';

const { BASE_URL, LOGIN_URL, REFRESH_URL, ENDPOINTS } = config;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const { data } = await axios.post(REFRESH_URL, { refresh });
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.reload();
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

const url = (path: string, params: Record<string, string> = {}) =>
  Object.entries(params).reduce((p, [k, v]) => p.replace(`:${k}`, v), path);

export const authApi = {
  login: (data: { username: string; password: string }) =>
    axios.post(LOGIN_URL, data),
  refresh: (refresh: string) =>
    axios.post(REFRESH_URL, { refresh }),
  forgotPassword: (email: string) =>
    axios.post(`${BASE_URL}${ENDPOINTS.AUTH.FORGOT_PASSWORD}`, { email }),
  resetPassword: (temp_token: string, new_password: string) =>
    axios.post(`${BASE_URL}${url(ENDPOINTS.AUTH.RESET_PASSWORD)}${temp_token}/`, { new_password }),
  changePassword: (new_password: string) =>
    api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { new_password }),
  register: (data: object) =>
    axios.post(`${BASE_URL}${ENDPOINTS.AUTH.REGISTER}`, data),
};

// Branch API — no branch_id filter (fetches all branches)
export const branchApi = {
  getAll: () => axios.get(`${BASE_URL}${ENDPOINTS.BRANCHES.BASE}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
  }),
  create: (data: object) => api.post(ENDPOINTS.BRANCHES.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.BRANCHES.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.BRANCHES.BY_ID, { id })),
};

export const userApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.USER.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.USER.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.USER.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.USER.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.USER.BY_ID, { id })),
};

export const classApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.CLASSES.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.CLASSES.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.CLASSES.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.CLASSES.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.CLASSES.BY_ID, { id })),
};

export const teacherApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.TEACHERS.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.TEACHERS.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.TEACHERS.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.TEACHERS.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.TEACHERS.BY_ID, { id })),
};

export const batchApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.BATCHES.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.BATCHES.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.BATCHES.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.BATCHES.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.BATCHES.BY_ID, { id })),
};

export const studentApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.STUDENTS.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.STUDENTS.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.STUDENTS.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.STUDENTS.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.STUDENTS.BY_ID, { id })),
};

export const attendanceApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.ATTENDANCE.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.ATTENDANCE.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.ATTENDANCE.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.ATTENDANCE.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.ATTENDANCE.BY_ID, { id })),
  getByBatch: (batchId: string, date?: string) =>
    api.get(url(ENDPOINTS.ATTENDANCE.BY_BATCH, { batchId }), { params: date ? { date } : {} }),
};

export const feeApi = {
  getAll: (page = 1) => api.get(ENDPOINTS.FEES.BASE, { params: { page } }),
  getById: (id: string) => api.get(url(ENDPOINTS.FEES.BY_ID, { id })),
  create: (data: object) => api.post(ENDPOINTS.FEES.BASE, data),
  update: (id: string, data: object) => api.put(url(ENDPOINTS.FEES.BY_ID, { id }), data),
  delete: (id: string) => api.delete(url(ENDPOINTS.FEES.BY_ID, { id })),
  collect: (data: object) => api.post(ENDPOINTS.FEES.COLLECT, data),
  getPending: () => api.get(ENDPOINTS.FEES.PENDING),
};

export const dashboardApi = {
  getStats: () => api.get(ENDPOINTS.DASHBOARD.STATS),
  getActivity: () => api.get(ENDPOINTS.DASHBOARD.ACTIVITY),
};

const downloadPdf = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const reportApi = {
  students: () =>
    api.get(ENDPOINTS.REPORTS.STUDENTS, { responseType: 'blob' })
      .then((r) => downloadPdf(r.data, 'student_report.pdf')),
  attendance: (params?: { batch_id?: string; date?: string; from_date?: string; to_date?: string }) =>
    api.get(ENDPOINTS.REPORTS.ATTENDANCE, { params, responseType: 'blob' })
      .then((r) => downloadPdf(r.data, 'attendance_report.pdf')),
  fees: (params?: { status?: string; month?: string }) =>
    api.get(ENDPOINTS.REPORTS.FEES, { params, responseType: 'blob' })
      .then((r) => downloadPdf(r.data, 'fee_report.pdf')),
  summary: () =>
    api.get(ENDPOINTS.REPORTS.SUMMARY, { responseType: 'blob' })
      .then((r) => downloadPdf(r.data, 'tms_summary_report.pdf')),
};

export default api;
