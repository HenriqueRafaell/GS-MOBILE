import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem } from '../types';

const FAVORITES_KEY = '@spaceconnect:favorites';

export async function getFavorites(): Promise<FavoriteItem[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
}

export async function addFavorite(item: FavoriteItem): Promise<void> {
  const current = await getFavorites();
  const exists = current.find(f => f.id === item.id);
  if (exists) return;
  const updated = [item, ...current];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function removeFavorite(id: string): Promise<void> {
  const current = await getFavorites();
  const updated = current.filter(f => f.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

export async function isFavorite(id: string): Promise<boolean> {
  const current = await getFavorites();
  return current.some(f => f.id === id);
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(FAVORITES_KEY);
}
