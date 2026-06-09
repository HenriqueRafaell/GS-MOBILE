import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ApodData } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { formatDate, truncate } from '../utils';

const { width } = Dimensions.get('window');

interface ApodCardProps {
  data: ApodData;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ApodCard({ data, onPress, isFavorite, onToggleFavorite }: ApodCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      {data.media_type === 'image' && data.url ? (
        <Image source={{ uri: data.url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Vídeo — toque para ver</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.date, { color: colors.primary }]}>{formatDate(data.date)}</Text>
          {onToggleFavorite && (
            <TouchableOpacity onPress={onToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 20 }}>{isFavorite ? '★' : '☆'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {data.title}
        </Text>

        {data.copyright && (
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © {data.copyright.trim()}
          </Text>
        )}

        <Text style={[styles.explanation, { color: colors.textSecondary }]}>
          {truncate(data.explanation, 120)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 11,
    marginBottom: 8,
  },
  explanation: {
    fontSize: 13,
    lineHeight: 19,
  },
});
