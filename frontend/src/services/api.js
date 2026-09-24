import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message || error.message || "Request failed";
    error.userMessage = message;
    return Promise.reject(error);
  },
);

export const documentApi = {
  list: () => api.get("/documents"),
  get: (id) => api.get(`/documents/${id}`),
  items: (id) => api.get(`/documents/${id}/items`),
  canonical: (id) => api.get(`/documents/${id}/canonical`),
  parse: (id) => api.post(`/documents/${id}/parse`),
  upload: (file) => {
    const body = new FormData();
    body.append("file", file);
    return api.post("/documents", body);
  },
  remove: (id) => api.delete(`/documents/${id}`),
};

export const reconciliationApi = {
  list: () => api.get("/reconciliations"),
  get: (id) => api.get(`/reconciliations/${id}`),
  exceptions: (id) => api.get(`/reconciliations/${id}/exceptions`),
  create: (actualDocumentId, filedDocumentId) =>
    api.post("/reconciliations", { actualDocumentId, filedDocumentId }),
};

export const reportApi = {
  download: (id, format) =>
    api.get(`/reports/reconciliations/${id}/report`, {
      params: { format },
      responseType: "blob",
    }),
};

export default api;
