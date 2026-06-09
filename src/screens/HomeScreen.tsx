import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useApod } from '../hooks/useApod';
import { useNeo } from '../hooks/useNeo';
import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import { ApodCard } from '../components/ApodCard';
import { NeoCard } from '../components/NeoCard';
import { WeatherCard } from '../components/WeatherCard';
import { SkeletonCard } from '../components/SkeletonCard';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const apod = useApod();
  const neo = useNeo(3);
  const weather = useWeather();
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const [refreshing, setRefreshing] = React.useState(false);
  const [apodFav, setApodFav] = React.useState(false);

  React.useEffect(() => {
    if (apod.data) {
      checkIsFavorite(apod.data.date).then(setApodFav);
    }
  }, [apod.data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([apod.refetch(), neo.refetch(), weather.refetch()]);
    setRefreshing(false);
  }, [apod, neo, weather]);

  const handleApodFavorite = async () => {
    if (!apod.data) return;
    await toggleFavorite({
      id: apod.data.date,
      type: 'apod',
      title: apod.data.title,
      subtitle: apod.data.date,
      imageUrl: apod.data.url,
      savedAt: new Date().toISOString(),
      data: apod.data,
    });
    const updated = await checkIsFavorite(apod.data.date);
    setApodFav(updated);
  };

  const highlightedNeo = neo.data.slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle={colors.background === '#080C1A' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.headerSection}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Bem-vindo ao</Text>
        <Text style={[styles.appName, { color: colors.primary }]}>SpaceConnect</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Conectando a Terra ao espaço
        </Text>
      </View>

      {/* Clima */}
      <SectionHeader title="Clima em SP" icon="🌍" colors={colors} />
      {weather.loading ? (
        <SkeletonCard height={140} />
      ) : weather.error ? (
        <ErrorBox message={weather.error} colors={colors} />
      ) : weather.data ? (
        <WeatherCard data={weather.data} />
      ) : null}

      {/* Foto do Dia */}
      <SectionHeader title="Foto do Dia (NASA)" icon="📸" colors={colors} />
      {apod.loading ? (
        <SkeletonCard height={320} />
      ) : apod.error ? (
        <ErrorBox message={apod.error} colors={colors} />
      ) : apod.data ? (
        <ApodCard
          data={apod.data}
          onPress={() => navigation.navigate('ApodDetail', { apod: apod.data! })}
          isFavorite={apodFav}
          onToggleFavorite={handleApodFavorite}
        />
      ) : null}

      {/* NEO em destaque */}
      <View style={styles.sectionRow}>
        <SectionHeader title="Asteroides Próximos" icon="☄️" colors={colors} inline />
        {neo.data.length > 0 && (
          <Text style={[styles.totalBadge, { color: colors.primary }]}>
            {neo.totalCount} esta semana
          </Text>
        )}
      </View>

      {neo.loading ? (
        <>
          <SkeletonCard height={110} />
          <SkeletonCard height={110} />
        </>
      ) : neo.error ? (
        <ErrorBox message={neo.error} colors={colors} />
      ) : (
        highlightedNeo.map(obj => (
          <NeoCard
            key={obj.id}
            data={obj}
            onPress={() => navigation.navigate('NeoDetail', { neo: obj })}
          />
        ))
      )}

      {neo.data.length > 3 && (
        <TouchableOpacity
          style={[styles.moreButton, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('MainTabs', undefined as any)}
          activeOpacity={0.8}
        >
          <Text style={[styles.moreButtonText, { color: colors.primary }]}>
            Ver todos os asteroides →
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function SectionHeader({
  title,
  icon,
  colors,
  inline,
}: {
  title: string;
  icon: string;
  colors: any;
  inline?: boolean;
}) {
  return (
    <View style={inline ? undefined : styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {icon}  {title}
      </Text>
    </View>
  );
}

function ErrorBox({ message, colors }: { message: string; colors: any }) {
  return (
    <View style={[styles.errorBox, { backgroundColor: colors.surface }]}>
      <Text style={{ color: '#FF5252', fontSize: 13 }}>⚠️  {message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  totalBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
});
