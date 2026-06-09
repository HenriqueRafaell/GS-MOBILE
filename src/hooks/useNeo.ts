import { useState, useEffect, useCallback } from 'react';
import { NeoObject } from '../types';
import { fetchNeoFeed } from '../services/nasaService';

interface UseNeoReturn {
  data: NeoObject[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function getDateRange(days = 7): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function useNeo(days = 7): UseNeoReturn {
  const [data, setData] = useState<NeoObject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { start, end } = getDateRange(days);
      const feed = await fetchNeoFeed(start, end);
      const all: NeoObject[] = [];
      Object.values(feed.near_earth_objects).forEach(dayList => {
        all.push(...dayList);
      });
      all.sort((a, b) => {
        const distA = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers ?? '999999999');
        const distB = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers ?? '999999999');
        return distA - distB;
      });
      setData(all);
      setTotalCount(feed.element_count);
    } catch (e: any) {
      setError(e?.message ?? 'Erro ao carregar asteroides');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, totalCount, loading, error, refetch: load };
}
