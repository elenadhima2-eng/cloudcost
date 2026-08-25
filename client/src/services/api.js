import axios from 'axios';
 
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});
 
// Shto token automatikisht çdo kërkese
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
 
// Menaxho 401 — redirect te login
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
 
// ── AUTH ──────────────────────────────────────────────────────────────────────
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);
export const getProfil = ()    => API.get('/auth/profil');
export const updateProfil  = (data) => API.put('/auth/profil', data);
export const deleteProfil  = ()     => API.delete('/auth/profil');
export const changeFjalekalim = (data) => API.put('/auth/fjalekalim', data);
 
// ── STARTUP / KOSTO ───────────────────────────────────────────────────────────
export const createStartup  = (data) => API.post('/startup/create', data);
export const getDashboard   = ()     => API.get('/startup/dashboard');
export const editStartup    = (id, data) => API.put(`/startup/edit/${id}`, data);
export const deleteStartup  = (id)   => API.delete(`/startup/delete/${id}`);
export const setLimit       = (data) => API.post('/startup/limit', data);
 
// ── BACKUP ────────────────────────────────────────────────────────────────────
export const uploadBackup   = (data) => API.post('/backup/upload', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const listBackups    = ()     => API.get('/backup/list');
export const deleteBackup   = (data) => API.delete('/backup/delete', { data });
 
// ── AI ───────────────────────────────────────────────────────────────
export const askChat        = (data) => API.post('/ai/ask', data);
export const analyzeAI      = ()     => API.post('/ai/analyze');
export const anomalyAI      = (data) => API.post('/ai/anomaly', data);
export const generateReport = (data) => API.post('/ai/report', data);