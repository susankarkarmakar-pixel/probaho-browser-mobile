import { useMemo } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton, SurfaceCard } from '../components/DesignPrimitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBrowserStore } from '../store/browserStore';
import { useLibraryStore, type DownloadItem, type LibraryEntry } from '../store/libraryStore';

type LibraryMode = 'bookmarks' | 'history' | 'downloads' | 'reading';
type LibraryRoute = RouteProp<{ Library: { mode?: LibraryMode } }, 'Library'>;
type DisplayItem = LibraryEntry | DownloadItem;

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

const isDownload = (item: DisplayItem): item is DownloadItem => 'filename' in item;

export const LibraryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<LibraryRoute>();
  const mode = route.params?.mode || 'bookmarks';
  const active = useMemo(() => MODES.find((item) => item.key === mode) || MODES[0], [mode]);
  const { addTab } = useBrowserStore();
  const {
    bookmarks,
    history,
    downloads,
    readingList,
    removeBookmark,
    removeReadingList,
    clearHistory,
  } = useLibraryStore();

  const data = useMemo<DisplayItem[]>(() => {
    if (mode === 'bookmarks') return bookmarks;
    if (mode === 'history') return history;
    if (mode === 'downloads') return downloads;
    return readingList;
  }, [bookmarks, downloads, history, mode, readingList]);

  const openEntry = (item: DisplayItem) => {
    if (isDownload(item)) return;
    addTab(item.url, item.title, false);
    navigation.navigate('Browser');
  };

  const removeEntry = (item: DisplayItem) => {
    if (isDownload(item)) return;
    if (mode === 'bookmarks') removeBookmark(item.url);
    if (mode === 'reading') removeReadingList(item.url);
    if (mode === 'history') clearHistory();
  };

  return (
    <ScreenContainer>
      <View testID="library-screen" style={styles.screen}>
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
              accessibilityLabel={`Show ${item.label}`}
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
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, data.length === 0 && styles.emptyList]}
          renderItem={({ item }) => {
            const download = isDownload(item);
            return (
              <SurfaceCard style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons
                    name={download ? 'download-outline' : active.icon}
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <Pressable
                  onPress={() => openEntry(item)}
                  style={({ pressed }) => [styles.rowContent, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel={download ? item.filename : `Open ${item.title}`}
                >
                  <Text numberOfLines={1} style={styles.rowTitle}>
                    {download ? item.filename : item.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.rowMeta}>
                    {download ? item.status : item.url}
                  </Text>
                </Pressable>
                {!download && (
                  <IconButton
                    icon="trash-outline"
                    label={`Remove ${item.title}`}
                    color={COLORS.danger}
                    onPress={() => removeEntry(item)}
                  />
                )}
              </SurfaceCard>
            );
          }}
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
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
  list: { padding: SPACING.md, gap: SPACING.sm },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, gap: SPACING.sm },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.privateSurface,
  },
  rowContent: { flex: 1, minWidth: 0, paddingVertical: SPACING.xs },
  rowTitle: { color: COLORS.text, ...TYPOGRAPHY.callout },
  rowMeta: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, marginTop: 3 },
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
