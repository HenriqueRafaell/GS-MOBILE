import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { formatDate } from '../utils';

type Route = RouteProp<RootStackParamList, 'ApodDetail'>;
const { width } = Dimensions.get('window');

export function ApodDetailScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const { apod } = params;
  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    checkIsFavorite(apod.date).then(setIsFav);
  }, [apod.date]);

  const handleFavorite = async () => {
    await toggleFavorite({
      id: apod.date,
      type: 'apod',
      title: apod.title,
      subtitle: apod.date,
      imageUrl: apod.url,
      savedAt: new Date().toISOString(),
      data: apod,
    });
    const updated = await checkIsFavorite(apod.date);
    setIsFav(updated);
  };

  const openHdUrl = () => {
    const url = apod.hdurl ?? apod.url;
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com voltar e favoritar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFavorite}>
          <Text style={{ fontSize: 26 }}>{isFav ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      {apod.media_type === 'image' && apod.url ? (
        <TouchableOpacity onPress={openHdUrl} activeOpacity={0.9}>
          <Image source={{ uri: apod.url }} style={styles.image} resizeMode="cover" />
          <View style={[styles.hdBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.hdText}>Toque para HD</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.videoPlaceholder, { backgroundColor: colors.surface }]}>
          <Text style={{ fontSize: 40 }}>▶️</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 8 }}>Vídeo disponível</Text>
          {apod.url && (
            <TouchableOpacity
              onPress={() => Linking.openURL(apod.url!)}
              style={[styles.watchBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Assistir</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.body}>
        <Text style={[styles.date, { color: colors.primary }]}>{formatDate(apod.date)}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{apod.title}</Text>
        {apod.copyright && (
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © {apod.copyright.trim()}
          </Text>
        )}
        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          {apod.explanation}
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
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
  backBtn: { padding: 4 },
  image: {
    width,
    height: width * 0.75,
  },
  hdBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hdText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  videoPlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchBtn: {
    marginTop: 14,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  body: { padding: 16 },
  date: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  title: { fontSize: 22, fontWeight: '800', lineHeight: 28, marginBottom: 6 },
  copyright: { fontSize: 12, marginBottom: 14 },
  explanation: { fontSize: 15, lineHeight: 24 },
});
