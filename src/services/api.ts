
// Centralized API service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types for API requests/responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  about?: string;
}

// Generic API client
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    this.accessToken = localStorage.getItem('accessToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const response = await this.request<{ user: User; tokens: AuthTokens }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success && response.data) {
      this.setTokens(response.data.tokens);
    }
    
    return response;
  }

  async register(userData: { name: string; username: string; email: string; password: string }) {
    return this.request<{ user: User; tokens: AuthTokens }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshTokens() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (response.success && response.data) {
      this.setTokens(response.data);
    }

    return response;
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  // Profile methods
  async getProfile() {
    return this.request<User>('/profile');
  }

  async updateProfile(profileData: Partial<User>) {
    return this.request<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Contacts methods
  async getContacts() {
    return this.request('/contacts');
  }

  async addContact(contactData: any) {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Call methods
  async initiateCall(callData: any) {
    return this.request('/calls/initiate', {
      method: 'POST',
      body: JSON.stringify(callData),
    });
  }

  async endCall(callId: string) {
    return this.request(`/calls/${callId}/end`, {
      method: 'POST',
    });
  }

  async getCallHistory() {
    return this.request('/calls/history');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
