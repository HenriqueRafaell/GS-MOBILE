import { useState, useCallback } from 'react';
import { FavoriteItem } from '../types';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
} from '../storage/favorites';

interface UseFavoritesReturn {
  favorites: FavoriteItem[];
  loading: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
  checkIsFavorite: (id: string) => Promise<boolean>;
  clearAll: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    const data = await getFavorites();
    setFavorites(data);
    setLoading(false);
  }, []);

  const toggleFavorite = useCallback(async (item: FavoriteItem) => {
    const exists = await isFavorite(item.id);
    if (exists) {
      await removeFavorite(item.id);
    } else {
      await addFavorite(item);
    }
    const updated = await getFavorites();
    setFavorites(updated);
  }, []);

  const checkIsFavorite = useCallback(async (id: string) => {
    return isFavorite(id);
  }, []);

  const clearAll = useCallback(async () => {
    await clearFavorites();
    setFavorites([]);
  }, []);

  return { favorites, loading, loadFavorites, toggleFavorite, checkIsFavorite, clearAll };
}
