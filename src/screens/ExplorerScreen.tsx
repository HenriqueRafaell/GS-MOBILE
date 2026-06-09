import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, NeoObject } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useNeo } from '../hooks/useNeo';
import { useFavorites } from '../hooks/useFavorites';
import { NeoCard } from '../components/NeoCard';
import { NeoChart } from '../components/NeoChart';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SortKey = 'distance' | 'name' | 'hazard';
type FilterKey = 'all' | 'hazardous' | 'safe';

export function ExplorerScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const { data, totalCount, loading, error, refetch } = useNeo(7);
  const { toggleFavorite, checkIsFavorite } = useFavorites();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('distance');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [favMap, setFavMap] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const loadFavs = async () => {
      const map: Record<string, boolean> = {};
      for (const neo of data) {
        map[neo.id] = await checkIsFavorite(neo.id);
      }
      setFavMap(map);
    };
    if (data.length > 0) loadFavs();
  }, [data]);

  const filtered = useMemo(() => {
    let result = [...data];

    if (filter === 'hazardous') result = result.filter(n => n.is_potentially_hazardous_asteroid);
    if (filter === 'safe') result = result.filter(n => !n.is_potentially_hazardous_asteroid);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n => n.name.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'hazard') {
        return Number(b.is_potentially_hazardous_asteroid) - Number(a.is_potentially_hazardous_asteroid);
      }
      const dA = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers ?? '999999999');
      const dB = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers ?? '999999999');
      return dA - dB;
    });

    return result;
  }, [data, search, sort, filter]);

  const handleToggleFav = async (neo: NeoObject) => {
    await toggleFavorite({
      id: neo.id,
      type: 'neo',
      title: neo.name,
      subtitle: `Asteroid — ${neo.close_approach_data[0]?.close_approach_date ?? ''}`,
      savedAt: new Date().toISOString(),
      data: neo,
    });
    const updated = await checkIsFavorite(neo.id);
    setFavMap(prev => ({ ...prev, [neo.id]: updated }));
  };

  const renderItem = ({ item }: { item: NeoObject }) => (
    <NeoCard
      data={item}
      onPress={() => navigation.navigate('NeoDetail', { neo: item })}
      isFavorite={favMap[item.id]}
      onToggleFavorite={() => handleToggleFav(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.background === '#080C1A' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explorador</Text>
        {totalCount > 0 && (
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {totalCount} asteroides (7 dias)
          </Text>
        )}
      </View>

      {/* Busca */}
      <View style={[styles.searchBox, { backgroundColor: colors.surface }]}>
        <Text style={{ color: colors.textSecondary }}>🔍  </Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar asteroide..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: colors.textSecondary }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {(['all', 'hazardous', 'safe'] as FilterKey[]).map(f => (
          <Chip
            key={f}
            label={f === 'all' ? 'Todos' : f === 'hazardous' ? '⚠️ Perigosos' : '✅ Seguros'}
            active={filter === f}
            onPress={() => setFilter(f)}
            colors={colors}
          />
        ))}
      </View>

      {/* Ordenação */}
      <View style={styles.sortRow}>
        <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Ordenar por:</Text>
        {([
          { key: 'distance', label: 'Distância' },
          { key: 'name', label: 'Nome' },
          { key: 'hazard', label: 'Perigo' },
        ] as { key: SortKey; label: string }[]).map(s => (
          <TouchableOpacity
            key={s.key}
            onPress={() => setSort(s.key)}
            style={[
              styles.sortChip,
              { borderColor: colors.border },
              sort === s.key && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                { color: sort === s.key ? '#fff' : colors.textSecondary },
              ]}
            >
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.list}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} height={110} style={{ marginBottom: 12 }} />)}
        </View>
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Erro ao carregar"
          message={error}
          actionLabel="Tentar novamente"
          onAction={refetch}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔭"
          title="Nenhum resultado"
          message="Tente mudar os filtros ou a busca"
          actionLabel="Limpar filtros"
          onAction={() => { setSearch(''); setFilter('all'); }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <NeoChart data={data} totalCount={totalCount} />
          }
        />
      )}
    </View>
  );
}

function Chip({ label, active, onPress, colors }: { label: string; active: boolean; onPress: () => void; colors: any }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: active ? colors.primary : colors.border },
        active && { backgroundColor: colors.primary },
      ]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, { color: active ? '#fff' : colors.textSecondary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '800' },
  count: { fontSize: 13, marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '600' },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  sortLabel: { fontSize: 12, fontWeight: '500' },
  sortChip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  sortChipText: { fontSize: 11, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
});
