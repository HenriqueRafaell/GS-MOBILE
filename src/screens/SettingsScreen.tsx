import React from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';

export function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { favorites, clearAll } = useFavorites();

  const isDark = theme === 'dark';

  const handleOpenNasa = () => Linking.openURL('https://api.nasa.gov');
  const handleOpenMeteo = () => Linking.openURL('https://open-meteo.com');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <Text style={[styles.screenTitle, { color: colors.text }]}>Configurações</Text>

      {/* Aparência */}
      <SectionLabel label="APARÊNCIA" colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingRow
          icon={isDark ? '🌙' : '☀️'}
          label="Modo escuro"
          colors={colors}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          }
        />
      </View>

      {/* Dados */}
      <SectionLabel label="DADOS" colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingRow
          icon="⭐"
          label="Favoritos salvos"
          value={`${favorites.length} itens`}
          colors={colors}
        />
        <Divider colors={colors} />
        <TouchableOpacity onPress={clearAll} activeOpacity={0.7}>
          <SettingRow icon="🗑️" label="Limpar favoritos" colors={colors} danger />
        </TouchableOpacity>
      </View>

      {/* APIs */}
      <SectionLabel label="FONTES DE DADOS" colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleOpenNasa} activeOpacity={0.7}>
          <SettingRow icon="🚀" label="NASA Open APIs" value="api.nasa.gov →" colors={colors} />
        </TouchableOpacity>
        <Divider colors={colors} />
        <TouchableOpacity onPress={handleOpenMeteo} activeOpacity={0.7}>
          <SettingRow icon="🌦️" label="Open-Meteo" value="open-meteo.com →" colors={colors} />
        </TouchableOpacity>
      </View>

      {/* Sobre */}
      <SectionLabel label="SOBRE" colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <SettingRow icon="📱" label="Aplicativo" value="SpaceConnect v1.0" colors={colors} />
        <Divider colors={colors} />
        <SettingRow icon="🎓" label="Disciplina" value="Mobile — FIAP" colors={colors} />
        <Divider colors={colors} />
        <SettingRow icon="🌍" label="Tema" value="Global Solution 2025" colors={colors} />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function SectionLabel({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{label}</Text>
  );
}

function Divider({ colors }: { colors: any }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

function SettingRow({
  icon,
  label,
  value,
  right,
  danger,
  colors,
}: {
  icon: string;
  label: string;
  value?: string;
  right?: React.ReactNode;
  danger?: boolean;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: danger ? '#FF5252' : colors.text }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingTop: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginTop: 20 },
  card: { borderRadius: 16, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: { fontSize: 20, marginRight: 14 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  rowValue: { fontSize: 13 },
  divider: { height: 1, marginLeft: 52 },
});
