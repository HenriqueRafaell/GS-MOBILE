import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SkeletonCardProps {
  height?: number;
  style?: ViewStyle;
}

export function SkeletonCard({ height = 180, style }: SkeletonCardProps) {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: false }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: false }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  const base: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    height,
  };

  return (
    <Animated.View style={[base, style, { opacity }]}>
      <View style={[styles.line, { backgroundColor: colors.border, width: '60%' }]} />
      <View style={[styles.line, { backgroundColor: colors.border, width: '90%', marginTop: 10 }]} />
      <View style={[styles.line, { backgroundColor: colors.border, width: '75%', marginTop: 8 }]} />
      <View style={[styles.line, { backgroundColor: colors.border, width: '45%', marginTop: 8 }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 14,
    borderRadius: 7,
  },
});
