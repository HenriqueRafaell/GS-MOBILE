import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types';
import { useTheme } from '../contexts/ThemeContext';

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Predominantemente limpo', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Névoa', icon: '🌫️' },
  48: { label: 'Névoa com gelo', icon: '🌫️' },
  51: { label: 'Garoa leve', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa intensa', icon: '🌧️' },
  61: { label: 'Chuva leve', icon: '🌧️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva forte', icon: '🌧️' },
  80: { label: 'Pancadas leves', icon: '⛈️' },
  81: { label: 'Pancadas moderadas', icon: '⛈️' },
  82: { label: 'Pancadas violentas', icon: '⛈️' },
  95: { label: 'Tempestade', icon: '⛈️' },
  99: { label: 'Tempestade com granizo', icon: '🌩️' },
};

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const { colors } = useTheme();
  const weather = WMO_CODES[data.weathercode] ?? { label: 'Desconhecido', icon: '🌡️' };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.main}>
        <Text style={styles.icon}>{weather.icon}</Text>
        <View>
          <Text style={[styles.temp, { color: colors.text }]}>
            {data.temperature.toFixed(1)}°C
          </Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{weather.label}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.detail}>
        <DetailItem icon="💨" label="Vento" value={`${data.windspeed.toFixed(1)} km/h`} colors={colors} />
        <DetailItem icon="📍" label="Local" value="São Paulo, BR" colors={colors} />
        <DetailItem icon="🕐" label="Atualizado" value={data.time.substring(11, 16)} colors={colors} />
      </View>
    </View>
  );
}

function DetailItem({
  icon,
  label,
  value,
  colors,
}: {
  icon: string;
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <View>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },
  icon: {
    fontSize: 48,
  },
  temp: {
    fontSize: 36,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailIcon: {
    fontSize: 18,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});
