import { useAuth } from '../../provider/authProvider';

interface ApiResponse {
  status: boolean;
  message: string;
  error: string[];
  data?: any;
}

interface RequestConfig extends RequestInit {
  requireAuth?: boolean;
}

const BASE_URL = 'http://localhost:3000/api';

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    const { accessToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    throw error;
  }
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const accessToken = localStorage.getItem('accessToken');

  const headers: HeadersInit = {};
  
  // Hanya set Content-Type jika bukan FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Cek jika error token kadaluarsa
      if (data.message === 'Token telah kadaluarsa') {
        // Refresh token dan coba request ulang
        const accessToken = await refreshToken();
        
        // Update header dengan token baru
        headers['Authorization'] = `Bearer ${accessToken}`;
        
        // Request ulang dengan token baru
        const newResponse = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
        });

        const newData = await newResponse.json();
        if (!newResponse.ok) {
          throw new Error(newData.message || 'Something went wrong');
        }

        return newData;
      }

      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
}
