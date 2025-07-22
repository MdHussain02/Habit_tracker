import { useCallback, useState } from 'react';
import { getRefreshToken } from '../utils/storage';

function isPlainObject(obj: any): obj is Record<string, string> {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = async () => {
    const refresh = await getRefreshToken();
    return refresh ? { Authorization: `Bearer ${refresh}` } : undefined;
  };

  const fetchApi = useCallback(async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    try {
      const authHeaders = await getAuthHeaders();
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isPlainObject(options.headers)) {
        headers = { ...headers, ...options.headers };
      }
      if (authHeaders && authHeaders.Authorization) {
        headers['Authorization'] = authHeaders.Authorization;
      }
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'API error');
      return data;
    } catch (err: any) {
      setError(err.message || 'API error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGet = useCallback((url: string) => fetchApi(url, { method: 'GET' }), [fetchApi]);
  const fetchPost = useCallback((url: string, body: any) => fetchApi(url, { method: 'POST', body: JSON.stringify(body) }), [fetchApi]);
  const fetchPut = useCallback((url: string, body: any) => fetchApi(url, { method: 'PUT', body: JSON.stringify(body) }), [fetchApi]);
  const fetchDelete = useCallback((url: string) => fetchApi(url, { method: 'DELETE' }), [fetchApi]);

  return { fetchGet, fetchPost, fetchPut, fetchDelete, loading, error };
} 