// Central API configuration for VizIQ frontend
let baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').trim().replace(/\/$/, '');

// If Render passed a bare internal hostname like "viziq-backend" (without TLD dot or scheme)
if (!baseUrl.includes('.') && !baseUrl.includes('localhost')) {
  baseUrl = `https://${baseUrl}.onrender.com`;
} else if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `https://${baseUrl}`;
}

export const API_BASE_URL = baseUrl;
