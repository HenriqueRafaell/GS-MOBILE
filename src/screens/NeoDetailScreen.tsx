import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { formatKm, formatNumber, getDiameterLabel, formatDate } from '../utils';

type Route = RouteProp<RootStackParamList, 'NeoDetail'>;

export function NeoDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const { neo } = params;
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);

  const hazardous = neo.is_potentially_hazardous_asteroid;
  const hazardColor = hazardous ? '#FF5252' : '#66BB6A';
  const { estimated_diameter_min, estimated_diameter_max } = neo.estimated_diameter.kilometers;

  useEffect(() => {
    checkIsFavorite(neo.id).then(setIsFav);
  }, [neo.id]);

  const handleFavorite = async () => {
    await toggleFavorite({
      id: neo.id,
      type: 'neo',
      title: neo.name,
      subtitle: neo.close_approach_data[0]?.close_approach_date ?? '',
      savedAt: new Date().toISOString(),
      data: neo,
    });
    const updated = await checkIsFavorite(neo.id);
    setIsFav(updated);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Topo */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavorite}>
          <Text style={{ fontSize: 26 }}>{isFav ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: colors.surface }]}>
        <Text style={styles.asteroidIcon}>☄️</Text>
        <Text style={[styles.neoName, { color: colors.text }]}>
          {neo.name.replace(/[()]/g, '').trim()}
        </Text>
        <View style={[styles.hazardBadge, { backgroundColor: hazardColor + '22', borderColor: hazardColor }]}>
          <Text style={[styles.hazardText, { color: hazardColor }]}>
            {hazardous ? '⚠️ Potencialmente Perigoso' : '✅ Classificado como Seguro'}
          </Text>
        </View>
      </View>

      {/* Dimensões */}
      <SectionCard label="Dimensões Estimadas" colors={colors}>
        <InfoRow label="Diâmetro mínimo" value={`${(estimated_diameter_min * 1000).toFixed(0)} m`} colors={colors} />
        <InfoRow label="Diâmetro máximo" value={`${(estimated_diameter_max * 1000).toFixed(0)} m`} colors={colors} />
        <InfoRow label="Média" value={getDiameterLabel(estimated_diameter_min, estimated_diameter_max)} colors={colors} />
      </SectionCard>

      {/* Aproximações */}
      <SectionCard label={`Aproximações (${neo.close_approach_data.length})`} colors={colors}>
        {neo.close_approach_data.map((ca, i) => (
          <View key={i} style={i > 0 ? [styles.approachDivider, { borderTopColor: colors.border }] : undefined}>
            <InfoRow label="Data" value={formatDate(ca.close_approach_date)} colors={colors} />
            <InfoRow label="Distância" value={formatKm(parseFloat(ca.miss_distance.kilometers))} colors={colors} />
            <InfoRow
              label="Velocidade"
              value={`${formatNumber(parseFloat(ca.relative_velocity.kilometers_per_hour).toFixed(0) as any)} km/h`}
              colors={colors}
            />
            <InfoRow label="Corpo orbital" value={ca.orbiting_body} colors={colors} />
          </View>
        ))}
      </SectionCard>

      {/* NASA */}
      <TouchableOpacity
        onPress={() => Linking.openURL(neo.nasa_jpl_url)}
        style={[styles.nasaBtn, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
      >
        <Text style={styles.nasaBtnText}>🚀  Ver no NASA JPL</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function SectionCard({ label, children, colors }: { label: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  hero: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 20,
  },
  asteroidIcon: { fontSize: 64, marginBottom: 12 },
  neoName: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  hazardBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  hazardText: { fontSize: 13, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  card: { borderRadius: 16, overflow: 'hidden' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  infoLabel: { fontSize: 13 },
  infoValue: { fontSize: 13, fontWeight: '600' },
  approachDivider: { borderTopWidth: 4, borderTopColor: 'transparent', marginTop: 4 },
  nasaBtn: {
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nasaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
