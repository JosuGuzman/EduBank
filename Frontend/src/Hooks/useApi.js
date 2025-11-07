import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Definimos fetchData fuera del useEffect, y lo memorizamos con useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || { message: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  }, dependencies);

  // Ejecutamos la primera carga con useEffect
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retornamos la función refetch (que simplemente vuelve a llamar fetchData)
  return { data, loading, error, refetch: fetchData };
};