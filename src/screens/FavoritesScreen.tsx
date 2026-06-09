import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, FavoriteItem, ApodData, NeoObject } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../utils';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();
  const { favorites, loading, loadFavorites, toggleFavorite, clearAll } = useFavorites();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleClearAll = () => {
    Alert.alert(
      'Limpar favoritos',
      'Tem certeza que deseja remover todos os favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  const handlePress = (item: FavoriteItem) => {
    if (item.type === 'apod') {
      navigation.navigate('ApodDetail', { apod: item.data as ApodData });
    } else {
      navigation.navigate('NeoDetail', { neo: item.data as NeoObject });
    }
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      {item.type === 'apod' && item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.iconThumb, { backgroundColor: colors.border }]}>
          <Text style={{ fontSize: 28 }}>{item.type === 'apod' ? '📸' : '☄️'}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.typeTag, { color: colors.primary }]}>
          {item.type === 'apod' ? 'NASA APOD' : 'Asteroide'}
        </Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Salvo em {formatDate(item.savedAt.split('T')[0])}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => toggleFavorite(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={{ fontSize: 20 }}>★</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.background === '#080C1A' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Favoritos</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={{ color: '#FF5252', fontSize: 13, fontWeight: '600' }}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? null : favorites.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="Nenhum favorito"
          message="Marque fotos da NASA ou asteroides como favoritos e eles aparecerão aqui."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id + item.savedAt}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  screenTitle: { fontSize: 28, fontWeight: '800' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  iconThumb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  typeTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
  },
});
