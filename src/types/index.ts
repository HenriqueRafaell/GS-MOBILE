export interface ApodData {
  date: string;
  explanation: string;
  media_type: 'image' | 'video';
  title: string;
  url: string;
  hdurl?: string;
  copyright?: string;
}

export interface NeoObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: CloseApproach[];
}

export interface CloseApproach {
  close_approach_date: string;
  orbiting_body: string;
  relative_velocity: {
    kilometers_per_hour: string;
  };
  miss_distance: {
    kilometers: string;
  };
}

export interface NeoFeed {
  element_count: number;
  near_earth_objects: Record<string, NeoObject[]>;
}

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

export interface FavoriteItem {
  id: string;
  type: 'apod' | 'neo';
  title: string;
  subtitle: string;
  imageUrl?: string;
  savedAt: string;
  data: ApodData | NeoObject;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: ColorScheme;
}

export interface ColorScheme {
  background: string;
  surface: string;
  card: string;
  primary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  danger: string;
  success: string;
  tabBar: string;
  tabBarBorder: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  NeoDetail: { neo: NeoObject };
  ApodDetail: { apod: ApodData };
};

export type TabParamList = {
  Home: undefined;
  Explorer: undefined;
  Favorites: undefined;
  Settings: undefined;
};
