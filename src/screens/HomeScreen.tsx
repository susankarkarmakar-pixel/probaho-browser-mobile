import React, { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton, QuickLinkGrid, SurfaceCard } from '../components/DesignPrimitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBrowserStore } from '../store/browserStore';
import { useSettingsStore } from '../store/settingsStore';
import { normalizeUrl } from '../utils/urlHelper';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { tabs, activeTabId, isPrivateMode, addTab, updateTab } = useBrowserStore();
  const { blockTrackers } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const blockedCount = useMemo(
    () => tabs.reduce((total, tab) => total + tab.blockedCount, 0),
    [tabs],
  );

  const navigate = (rawInput: string) => {
    const url = normalizeUrl(rawInput || '');
    if (activeTabId) updateTab(activeTabId, { url, title: rawInput.trim() || 'New Tab' });
    else addTab(url, 'New Tab', isPrivateMode);
    setSearchQuery('');
    navigation.navigate('Browser');
  };

  const handleQuickLink = (query: string) => {
    if (!query) {
      navigation.navigate('Browser');
      return;
    }
    navigate(query);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Probaho</Text>
            <Text style={styles.greeting}>
              {isPrivateMode ? 'Private browsing' : 'Good morning'}
            </Text>
          </View>
          <IconButton
            icon="person-outline"
            label="Open profile"
            variant="filled"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <Pressable
          onPress={() => navigation.navigate('PrivacyDashboard')}
          style={({ pressed }) => [styles.shieldTile, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Open privacy dashboard"
        >
          <Ionicons
            name={isPrivateMode ? 'eye-off-outline' : 'shield-checkmark-outline'}
            size={29}
            color={COLORS.primary}
          />
          <Text style={styles.shieldLabel}>{isPrivateMode ? 'Private' : 'Protected'}</Text>
        </Pressable>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={22} color={COLORS.secondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => navigate(searchQuery)}
            placeholder="Search or enter address"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
          />
          <Ionicons name="mic-outline" size={20} color={COLORS.textMuted} />
        </View>

        <QuickLinkGrid onSelect={handleQuickLink} />

        <SurfaceCard style={styles.privacyCard}>
          <View style={styles.privacyTitleRow}>
            <View style={styles.privacyBadge}>
              <Ionicons name="shield-checkmark-outline" size={21} color={COLORS.primary} />
            </View>
            <View style={styles.privacyCopy}>
              <Text style={styles.privacyTitle}>Transparent security</Text>
              <Text style={styles.privacySubtitle}>
                {blockTrackers
                  ? 'Protection is active on this device'
                  : 'Tracker protection is paused'}
              </Text>
            </View>
          </View>
          <View style={styles.privacyStats}>
            <View>
              <Text style={styles.statValue}>{blockedCount || '—'}</Text>
              <Text style={styles.statLabel}>TRACKERS BLOCKED</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{tabs.length}</Text>
              <Text style={styles.statLabel}>OPEN TABS</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{activeTab?.isPrivate ? 'ON' : 'OFF'}</Text>
              <Text style={styles.statLabel}>PRIVATE MODE</Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate('PrivacyDashboard')}
            style={({ pressed }) => [styles.viewReport, pressed && styles.pressed]}
          >
            <Text style={styles.viewReportText}>View privacy dashboard</Text>
            <Ionicons name="arrow-forward" size={17} color={COLORS.secondary} />
          </Pressable>
        </SurfaceCard>

        <Text style={styles.sectionTitle}>Your shortcuts</Text>
        <View style={styles.shortcutRow}>
          <Shortcut
            icon="bookmark-outline"
            label="Bookmarks"
            onPress={() => navigation.navigate('Library', { mode: 'bookmarks' })}
          />
          <Shortcut
            icon="time-outline"
            label="History"
            onPress={() => navigation.navigate('Library', { mode: 'history' })}
          />
          <Shortcut
            icon="download-outline"
            label="Downloads"
            onPress={() => navigation.navigate('Library', { mode: 'downloads' })}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const Shortcut = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Ionicons name={icon} size={22} color={COLORS.textMuted} />
    <Text style={styles.shortcutLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brand: { color: COLORS.primary, fontSize: 19, fontWeight: '700', lineHeight: 24 },
  greeting: {
    color: COLORS.text,
    ...TYPOGRAPHY.callout,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  shieldTile: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  shieldLabel: { color: COLORS.textSubtle, ...TYPOGRAPHY.caption, marginTop: 4 },
  searchBar: {
    height: 58,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    ...TYPOGRAPHY.body,
    marginHorizontal: SPACING.sm,
    paddingVertical: 0,
  },
  privacyCard: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.surfaceHigh,
    borderColor: COLORS.secondaryContainer,
  },
  privacyTitleRow: { flexDirection: 'row', alignItems: 'center' },
  privacyBadge: {
    width: 42,
    height: 42,
    borderRadius: RADII.full,
    backgroundColor: 'rgba(211,187,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCopy: { marginLeft: SPACING.sm, flex: 1 },
  privacyTitle: { color: COLORS.text, ...TYPOGRAPHY.headline },
  privacySubtitle: { color: COLORS.textMuted, ...TYPOGRAPHY.footnote, marginTop: 2 },
  privacyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
  },
  statValue: { color: COLORS.text, fontSize: 23, lineHeight: 28, fontWeight: '700' },
  statLabel: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, marginTop: 2 },
  viewReport: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
  },
  viewReportText: { color: COLORS.secondary, ...TYPOGRAPHY.subhead },
  sectionTitle: {
    color: COLORS.text,
    ...TYPOGRAPHY.headline,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  shortcutRow: { flexDirection: 'row', gap: SPACING.sm },
  shortcut: {
    flex: 1,
    minHeight: 76,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  shortcutLabel: { color: COLORS.textMuted, ...TYPOGRAPHY.caption },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
