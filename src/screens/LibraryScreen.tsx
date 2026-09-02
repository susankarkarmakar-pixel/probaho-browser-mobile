import React, { useMemo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton, SurfaceCard } from '../components/DesignPrimitives';
import { ScreenContainer } from '../components/ScreenContainer';

type LibraryMode = 'bookmarks' | 'history' | 'downloads' | 'reading';
type LibraryRoute = RouteProp<{ Library: { mode?: LibraryMode } }, 'Library'>;
const MODES: {
  key: LibraryMode;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { key: 'bookmarks', label: 'Bookmarks', icon: 'bookmark-outline' },
  { key: 'history', label: 'History', icon: 'time-outline' },
  { key: 'downloads', label: 'Downloads', icon: 'download-outline' },
  { key: 'reading', label: 'Reading list', icon: 'book-outline' },
];

export const LibraryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<LibraryRoute>();
  const mode = route.params?.mode || 'bookmarks';
  const active = useMemo(() => MODES.find((item) => item.key === mode) || MODES[0], [mode]);
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <IconButton icon="arrow-back" label="Back" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Library</Text>
        <IconButton icon="search-outline" label="Search library" onPress={() => undefined} />
      </View>
      <View style={styles.modeScroller}>
        {MODES.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => navigation.setParams({ mode: item.key })}
            style={({ pressed }) => [
              styles.modeButton,
              active.key === item.key && styles.modeActive,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
          >
            <Ionicons
              name={item.icon}
              size={16}
              color={active.key === item.key ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.modeLabel, active.key === item.key && styles.modeLabelActive]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={[] as { id: string }[]}
        keyExtractor={(item) => item.id}
        renderItem={() => null}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <SurfaceCard style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name={active.icon} size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No {active.label.toLowerCase()} yet</Text>
            <Text style={styles.emptyText}>
              {mode === 'bookmarks'
                ? 'Save pages from the browser to keep them close at hand.'
                : mode === 'history'
                  ? 'Pages you visit will appear here on this device.'
                  : mode === 'downloads'
                    ? 'Downloaded files will appear here when downloads are enabled.'
                    : 'Save an article from the browser to read it later.'}
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Browser')}
              style={({ pressed }) => [styles.emptyAction, pressed && styles.pressed]}
              accessibilityRole="button"
            >
              <Text style={styles.emptyActionText}>Open browser</Text>
              <Ionicons name="arrow-forward" size={17} color={COLORS.surfaceMuted} />
            </Pressable>
          </SurfaceCard>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { color: COLORS.text, ...TYPOGRAPHY.headline },
  modeScroller: {
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  modeButton: {
    minHeight: 38,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  modeActive: { borderColor: COLORS.primaryContainer, backgroundColor: COLORS.privateSurface },
  modeLabel: { color: COLORS.textMuted, ...TYPOGRAPHY.caption },
  modeLabelActive: { color: COLORS.primary },
  list: { flexGrow: 1, padding: SPACING.md, justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: SPACING.xl, backgroundColor: COLORS.surface },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(211,187,255,0.14)',
  },
  emptyTitle: { color: COLORS.text, ...TYPOGRAPHY.headline, marginTop: SPACING.md },
  emptyText: {
    color: COLORS.textMuted,
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: SPACING.sm,
    maxWidth: 300,
  },
  emptyAction: {
    height: 46,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  emptyActionText: { color: COLORS.surfaceMuted, ...TYPOGRAPHY.callout },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
