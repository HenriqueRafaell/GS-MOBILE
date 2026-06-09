import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { NeoObject } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { formatKm } from '../utils';

interface NeoChartProps {
  data: NeoObject[];
  totalCount: number;
}

export function NeoChart({ data, totalCount }: NeoChartProps) {
  const { colors } = useTheme();

  const hazardous = data.filter(n => n.is_potentially_hazardous_asteroid).length;
  const safe = data.length - hazardous;
  const hazardPct = data.length > 0 ? hazardous / data.length : 0;
  const safePct = data.length > 0 ? safe / data.length : 0;

  const hazardAnim = useRef(new Animated.Value(0)).current;
  const safeAnim = useRef(new Animated.Value(0)).current;

  const distances = data
    .map(n => parseFloat(n.close_approach_data[0]?.miss_distance.kilometers ?? '0'))
    .filter(d => d > 0)
    .sort((a, b) => a - b);

  const maxDist = distances[distances.length - 1] ?? 1;
  const distBuckets = [
    { label: '< 1M km', count: distances.filter(d => d < 1_000_000).length },
    { label: '1M–5M km', count: distances.filter(d => d >= 1_000_000 && d < 5_000_000).length },
    { label: '> 5M km', count: distances.filter(d => d >= 5_000_000).length },
  ];
  const maxBucket = Math.max(...distBuckets.map(b => b.count), 1);

  const bucketAnims = useRef(distBuckets.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (data.length === 0) return;
    Animated.parallel([
      Animated.timing(hazardAnim, { toValue: hazardPct, duration: 700, delay: 100, useNativeDriver: false }),
      Animated.timing(safeAnim, { toValue: safePct, duration: 700, delay: 100, useNativeDriver: false }),
      ...bucketAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: distBuckets[i].count / maxBucket,
          duration: 600,
          delay: 200 + i * 100,
          useNativeDriver: false,
        })
      ),
    ]).start();
  }, [data.length]);

  if (data.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>📊  Resumo da Semana</Text>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        <StatCard label="Total" value={String(totalCount)} color={colors.primary} colors={colors} />
        <StatCard label="Perigosos" value={String(hazardous)} color="#FF5252" colors={colors} />
        <StatCard label="Seguros" value={String(safe)} color="#66BB6A" colors={colors} />
      </View>

      {/* Barra de proporção */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Classificação de risco</Text>
      <View style={styles.barTrack}>
        <BarRow
          label="Perigosos"
          pct={hazardPct}
          anim={hazardAnim}
          color="#FF5252"
          colors={colors}
        />
        <BarRow
          label="Seguros"
          pct={safePct}
          anim={safeAnim}
          color="#66BB6A"
          colors={colors}
        />
      </View>

      {/* Gráfico de distâncias */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 14 }]}>
        Distribuição por distância
      </Text>
      <View style={styles.bucketsRow}>
        {distBuckets.map((bucket, i) => (
          <View key={bucket.label} style={styles.bucketCol}>
            <Text style={[styles.bucketCount, { color: colors.text }]}>{bucket.count}</Text>
            <View style={[styles.bucketTrack, { backgroundColor: colors.border }]}>
              <Animated.View
                style={[
                  styles.bucketFill,
                  {
                    backgroundColor: colors.primary,
                    height: bucketAnims[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={[styles.bucketLabel, { color: colors.textSecondary }]}>{bucket.label}</Text>
          </View>
        ))}
      </View>

      {/* Mais próximo */}
      {distances.length > 0 && (
        <View style={[styles.closestBadge, { backgroundColor: colors.border }]}>
          <Text style={[styles.closestText, { color: colors.textSecondary }]}>
            ☄️  Mais próximo esta semana:{' '}
            <Text style={{ color: colors.primary, fontWeight: '700' }}>
              {formatKm(distances[0])}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
}

function StatCard({
  label,
  value,
  color,
  colors,
}: {
  label: string;
  value: string;
  color: string;
  colors: any;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: color + '18', borderColor: color + '44' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

function BarRow({
  label,
  pct,
  anim,
  color,
  colors,
}: {
  label: string;
  pct: number;
  anim: Animated.Value;
  color: string;
  colors: any;
}) {
  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.bar, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: color,
              width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            },
          ]}
        />
      </View>
      <Text style={[styles.barPct, { color }]}>{(pct * 100).toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  barTrack: {
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 72,
    fontSize: 12,
  },
  bar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  barPct: {
    width: 36,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  bucketsRow: {
    flexDirection: 'row',
    gap: 12,
    height: 100,
    alignItems: 'flex-end',
  },
  bucketCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bucketCount: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  bucketTrack: {
    width: '60%',
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bucketFill: {
    width: '100%',
    borderRadius: 6,
  },
  bucketLabel: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  closestBadge: {
    marginTop: 14,
    borderRadius: 10,
    padding: 10,
  },
  closestText: {
    fontSize: 12,
  },
});
