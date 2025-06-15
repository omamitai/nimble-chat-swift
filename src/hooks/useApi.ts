
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

export function useApiCall<T>(
  apiCall: () => Promise<any>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

export function useAuth() {
  const login = async (username: string, password: string) => {
    return apiClient.login({ username, password });
  };

  const register = async (userData: { name: string; username: string; email: string; password: string }) => {
    return apiClient.register(userData);
  };

  const logout = () => {
    apiClient.logout();
  };

  return { login, register, logout };
}
