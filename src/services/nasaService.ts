import axios from 'axios';
import { ApodData, NeoFeed } from '../types';

const NASA_BASE = 'https://api.nasa.gov';
const API_KEY = 'DEMO_KEY';

const nasaApi = axios.create({
  baseURL: NASA_BASE,
  timeout: 15000,
});

export async function fetchApod(): Promise<ApodData> {
  const { data } = await nasaApi.get<ApodData>('/planetary/apod', {
    params: { api_key: API_KEY },
  });
  return data;
}

export async function fetchApodRange(startDate: string, endDate: string): Promise<ApodData[]> {
  const { data } = await nasaApi.get<ApodData[]>('/planetary/apod', {
    params: { api_key: API_KEY, start_date: startDate, end_date: endDate },
  });
  return data;
}

export async function fetchNeoFeed(startDate: string, endDate: string): Promise<NeoFeed> {
  const { data } = await nasaApi.get<NeoFeed>('/neo/rest/v1/feed', {
    params: { start_date: startDate, end_date: endDate, api_key: API_KEY },
  });
  return data;
}

export async function fetchNeoToday(): Promise<NeoFeed> {
  const today = new Date().toISOString().split('T')[0];
  return fetchNeoFeed(today, today);
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Céu limpo';
  if (code <= 3) return 'Parcialmente nublado';
  if (code <= 9) return 'Neblina';
  if (code <= 19) return 'Precipitação';
  if (code <= 29) return 'Tempestade';
  if (code <= 39) return 'Tempestade de poeira';
  if (code <= 49) return 'Neblina gelada';
  if (code <= 59) return 'Garoa';
  if (code <= 69) return 'Chuva';
  if (code <= 79) return 'Neve';
  if (code <= 89) return 'Aguaceiro';
  return 'Tempestade elétrica';
}
