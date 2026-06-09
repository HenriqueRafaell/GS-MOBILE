import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';
import { fetchCurrentWeather } from '../services/weatherService';

interface UseWeatherReturn {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCurrentWeather();
      setData(result);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar clima');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
