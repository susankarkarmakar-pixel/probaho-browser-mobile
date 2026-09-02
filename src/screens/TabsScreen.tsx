import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton } from '../components/DesignPrimitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBrowserStore, Tab } from '../store/browserStore';
import { getDomainFromUrl } from '../utils/urlHelper';

export const TabsScreen = () => {
  const navigation = useNavigation<any>();
  const {
    tabs,
    activeTabId,
    isPrivateMode,
    addTab,
    closeTab,
    closeAllTabs,
    setActiveTab,
    setPrivateMode,
    clearPrivateData,
  } = useBrowserStore();

  const handleNewTab = () => {
    addTab(undefined, 'New Tab', isPrivateMode);
    navigation.navigate('Browser');
  };
  const handlePrivate = () => {
    if (isPrivateMode) {
      Alert.alert('Leave private mode?', 'Private tabs will be cleared from this session.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            clearPrivateData();
            setPrivateMode(false);
          },
        },
      ]);
    } else {
      setPrivateMode(true);
      addTab(undefined, 'Private tab', true);
      navigation.navigate('Browser');
    }
  };
  const handleCloseAll = () =>
    Alert.alert(
      'Close all tabs?',
      'Your normal browsing tabs will remain available after this action.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Close all', style: 'destructive', onPress: closeAllTabs },
      ],
    );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <IconButton
          icon="grid-outline"
          label="Tab overview"
          variant="filled"
          onPress={() => undefined}
        />
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Tabs</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{tabs.length}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Browser')}
          style={({ pressed }) => [styles.doneButton, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
      <View style={styles.modeRow}>
        <Text style={styles.modeText}>
          {isPrivateMode ? 'Private browsing is active' : 'All tabs'}
        </Text>
        <Pressable
          onPress={handlePrivate}
          style={({ pressed }) => [styles.privateButton, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons
            name={isPrivateMode ? 'eye-off-outline' : 'eye-outline'}
            size={17}
            color={COLORS.primary}
          />
          <Text style={styles.privateText}>{isPrivateMode ? 'Leave' : 'Private'}</Text>
        </Pressable>
      </View>
      <FlatList
        data={tabs}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TabCard
            item={item}
            active={item.id === activeTabId}
            onPress={() => {
              setActiveTab(item.id);
              navigation.navigate('Browser');
            }}
            onClose={() => closeTab(item.id)}
          />
        )}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="copy-outline" size={30} color={COLORS.textSubtle} />
            <Text style={styles.emptyTitle}>No open tabs</Text>
            <Text style={styles.emptyText}>Create a tab to start browsing privately.</Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <Pressable
          onPress={handleCloseAll}
          style={({ pressed }) => [styles.closeAll, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          <Text style={styles.closeAllText}>Close All</Text>
        </Pressable>
        <Pressable
          onPress={handleNewTab}
          style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="New tab"
        >
          <Ionicons name="add" size={28} color={COLORS.surfaceMuted} />
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

const TabCard = ({
  item,
  active,
  onPress,
  onClose,
}: {
  item: Tab;
  active: boolean;
  onPress: () => void;
  onClose: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.tabCard,
      active && styles.activeCard,
      item.isPrivate && styles.privateCard,
      pressed && styles.pressed,
    ]}
    accessibilityRole="button"
    accessibilityLabel={`Open ${item.title}`}
  >
    <View style={styles.preview}>
      <View style={styles.previewTop}>
        <Ionicons
          name={item.isPrivate ? 'eye-off-outline' : 'globe-outline'}
          size={15}
          color={item.isPrivate ? COLORS.primary : COLORS.secondary}
        />
        <View style={styles.previewLines}>
          <View style={styles.previewLineLong} />
          <View style={styles.previewLineShort} />
        </View>
      </View>
      <View style={styles.previewBody}>
        <View style={styles.previewDot} />
        <View style={styles.previewLine} />
        <View style={styles.previewLine} />
      </View>
    </View>
    <View style={styles.cardMeta}>
      <View style={styles.metaCopy}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title || 'New Tab'}
        </Text>
        <Text style={styles.cardDomain} numberOfLines={1}>
          {getDomainFromUrl(item.url)}
        </Text>
      </View>
      <Pressable
        onPress={onClose}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Close ${item.title}`}
      >
        <Ionicons name="close" size={20} color={COLORS.textMuted} />
      </Pressable>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { color: COLORS.text, ...TYPOGRAPHY.title },
  countBadge: {
    minWidth: 27,
    height: 27,
    borderRadius: RADII.full,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { color: COLORS.textMuted, ...TYPOGRAPHY.subhead },
  doneButton: { minHeight: 44, justifyContent: 'center', paddingHorizontal: SPACING.sm },
  doneText: { color: COLORS.primary, ...TYPOGRAPHY.callout },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  modeText: { color: COLORS.textMuted, ...TYPOGRAPHY.footnote },
  privateButton: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: SPACING.xs },
  privateText: { color: COLORS.primary, ...TYPOGRAPHY.footnote },
  list: { padding: SPACING.md, paddingBottom: 125 },
  column: { gap: SPACING.md, marginBottom: SPACING.md },
  tabCard: {
    flex: 1,
    maxWidth: '48.2%',
    minHeight: 190,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  activeCard: { borderColor: COLORS.secondary, borderWidth: 2 },
  privateCard: { backgroundColor: COLORS.privateSurface },
  preview: { height: 118, backgroundColor: COLORS.surfaceHighest, padding: SPACING.sm },
  previewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },
  previewLines: { flex: 1, gap: 4 },
  previewLineLong: { height: 5, borderRadius: 3, backgroundColor: COLORS.border },
  previewLineShort: {
    width: '55%',
    height: 4,
    borderRadius: 3,
    backgroundColor: COLORS.borderSoft,
  },
  previewBody: { paddingTop: SPACING.md, gap: SPACING.sm },
  previewDot: {
    width: 31,
    height: 31,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.secondaryContainer,
  },
  previewLine: { width: '80%', height: 5, borderRadius: 3, backgroundColor: COLORS.borderSoft },
  cardMeta: {
    minHeight: 70,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaCopy: { flex: 1 },
  cardTitle: { color: COLORS.text, ...TYPOGRAPHY.subhead },
  cardDomain: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, marginTop: 3 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 88,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  closeAll: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, minHeight: 44 },
  closeAllText: { color: COLORS.danger, ...TYPOGRAPHY.callout },
  fab: {
    width: 58,
    height: 58,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyTitle: { color: COLORS.text, ...TYPOGRAPHY.headline, marginTop: SPACING.md },
  emptyText: {
    color: COLORS.textMuted,
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
