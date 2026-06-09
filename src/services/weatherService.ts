import axios from 'axios';
import { WeatherData } from '../types';

const WEATHER_BASE = 'https://api.open-meteo.com/v1';

const weatherApi = axios.create({
  baseURL: WEATHER_BASE,
  timeout: 10000,
});

// Default coords: São Paulo, Brazil
const DEFAULT_LAT = -23.5505;
const DEFAULT_LON = -46.6333;

export async function fetchCurrentWeather(
  latitude = DEFAULT_LAT,
  longitude = DEFAULT_LON,
): Promise<WeatherData> {
  const { data } = await weatherApi.get('/forecast', {
    params: {
      latitude,
      longitude,
      current_weather: true,
      timezone: 'America/Sao_Paulo',
    },
  });

  const cw = data.current_weather;
  return {
    temperature: Math.round(cw.temperature),
    windspeed: Math.round(cw.windspeed),
    weathercode: cw.weathercode,
    time: cw.time,
  };
}
