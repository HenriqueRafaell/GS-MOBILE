import { useState, useEffect, useCallback } from 'react';
import { ApodData } from '../types';
import { fetchApod } from '../services/nasaService';

interface UseApodReturn {
  data: ApodData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApod(): UseApodReturn {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchApod();
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar APOD');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
