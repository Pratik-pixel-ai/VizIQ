// Central API configuration for VizIQ frontend
let baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').trim().replace(/\/$/, '');
if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `https://${baseUrl}`;
}
export const API_BASE_URL = baseUrl;
