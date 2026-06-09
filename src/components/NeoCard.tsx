import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NeoObject } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { formatKm, getDiameterLabel, getHazardLabel } from '../utils';

interface NeoCardProps {
  data: NeoObject;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function NeoCard({ data, onPress, isFavorite, onToggleFavorite }: NeoCardProps) {
  const { colors } = useTheme();
  const hazardous = data.is_potentially_hazardous_asteroid;
  const approach = data.close_approach_data[0];
  const missKm = approach ? parseFloat(approach.miss_distance.kilometers) : null;
  const { estimated_diameter_min, estimated_diameter_max } = data.estimated_diameter.kilometers;

  const hazardColor = hazardous ? '#FF5252' : '#66BB6A';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.hazardBar, { backgroundColor: hazardColor }]} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {data.name.replace(/[()]/g, '').trim()}
          </Text>
          {onToggleFavorite && (
            <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 18 }}>{isFavorite ? '★' : '☆'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: hazardColor, borderColor: hazardColor }]}>
            {getHazardLabel(hazardous)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Stat
            label="Diâmetro"
            value={getDiameterLabel(estimated_diameter_min, estimated_diameter_max)}
            colors={colors}
          />
          {missKm !== null && (
            <Stat label="Dist. Terra" value={formatKm(missKm)} colors={colors} />
          )}
          {approach && (
            <Stat
              label="Velocidade"
              value={`${parseFloat(approach.relative_velocity.kilometers_per_hour).toFixed(0)} km/h`}
              colors={colors}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Stat({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  hazardBar: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexShrink: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});
