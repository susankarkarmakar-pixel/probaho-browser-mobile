import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton, PrivacyMetricCard, SurfaceCard } from '../components/DesignPrimitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBrowserStore } from '../store/browserStore';
import { useLibraryStore } from '../store/libraryStore';
import { usePrivacyStore } from '../store/privacyStore';

const getDayLabel = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });

export const PrivacyDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { clearPrivateData: clearBrowserPrivateData } = useBrowserStore();
  const { clearPrivateData: clearLibraryPrivateData } = useLibraryStore();
  const { totals, recentActivity, clearPrivacyData } = usePrivacyStore();
  const dailyActivity = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(now.getDate() - (6 - index));
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      const count = recentActivity.filter((item) => {
        const timestamp = new Date(item.timestamp).getTime();
        return timestamp >= date.getTime() && timestamp < nextDate.getTime();
      }).length;
      return { label: getDayLabel(date), count };
    });
  }, [recentActivity]);
  const maxDailyActivity = Math.max(1, ...dailyActivity.map((item) => item.count));
  const topTrackers = useMemo(() => {
    const counts = recentActivity
      .filter((item) => item.kind === 'tracker')
      .reduce<Record<string, number>>((result, item) => {
        result[item.host] = (result[item.host] || 0) + 1;
        return result;
      }, {});
    return Object.entries(counts)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 5);
  }, [recentActivity]);
  const clearData = () =>
    Alert.alert(
      'Clear all browsing data?',
      'This clears private tabs, history, privacy activity, and resets the current session. Your settings remain unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all data',
          style: 'destructive',
          onPress: () => {
            clearBrowserPrivateData();
            clearLibraryPrivateData();
            clearPrivacyData();
          },
        },
      ],
    );
  const exportReport = () =>
    Alert.alert(
      'Report ready',
      'Export is prepared from the protection data currently available on this device.',
    );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View testID="privacy-dashboard-screen" style={styles.header}>
          <IconButton icon="arrow-back" label="Back" onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Privacy Dashboard</Text>
          <IconButton
            icon="close"
            label="Close dashboard"
            onPress={() => navigation.navigate('Home')}
          />
        </View>
        <SurfaceCard style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="shield-checkmark-outline" size={32} color={COLORS.secondary} />
          </View>
          <Text style={styles.heroValue}>{totals.trackersBlocked || '—'}</Text>
          <Text style={styles.heroLabel}>Trackers Blocked</Text>
          <Text style={styles.heroCaption}>CURRENT SESSION</Text>
        </SurfaceCard>
        <View style={styles.metricsGrid}>
          <PrivacyMetricCard
            icon="megaphone-outline"
            value={String(totals.adsBlocked || '—')}
            label="Ads Blocked"
            accent={COLORS.danger}
            style={styles.metricCard}
          />
          <PrivacyMetricCard
            icon="timer-outline"
            value="—"
            label="Time Saved"
            accent={COLORS.warning}
            style={styles.metricCard}
          />
          <PrivacyMetricCard
            icon="cloud-outline"
            value="—"
            label="Data Saved"
            accent={COLORS.primary}
            style={styles.metricCard}
          />
          <PrivacyMetricCard
            icon="lock-closed-outline"
            value={String(totals.httpsUpgrades || '—')}
            label="HTTPS Upgrades"
            accent={COLORS.secondary}
            style={styles.metricCard}
          />
        </View>
        <Text style={styles.sectionTitle}>Tracking Activity</Text>
        <SurfaceCard style={styles.chartCard}>
          <View style={styles.chart}>
            <View style={styles.chartLine} />
            <View style={styles.chartLine} />
            <View style={styles.chartLine} />
            <View style={styles.chartBars}>
              {dailyActivity.map((day) => (
                <View key={day.label} style={styles.barWrap}>
                  <View
                    style={[
                      styles.bar,
                      { height: day.count ? Math.max(8, (day.count / maxDailyActivity) * 110) : 4 },
                    ]}
                  />
                  <Text style={styles.day}>{day.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.chartNote}>
            {totals.requests
              ? `${totals.requests} privacy decisions recorded on this device.`
              : 'Activity history will appear as protection events are recorded.'}
          </Text>
        </SurfaceCard>
        <Text style={styles.sectionTitle}>Top Trackers Blocked</Text>
        {topTrackers.length > 0 ? (
          topTrackers.map(([host, count]) => (
            <SurfaceCard key={host} style={styles.trackerRow}>
              <View style={styles.trackerIcon}>
                <Ionicons name="radio-outline" size={18} color={COLORS.secondary} />
              </View>
              <Text numberOfLines={1} style={styles.trackerHost}>
                {host}
              </Text>
              <Text style={styles.trackerCount}>{count}</Text>
            </SurfaceCard>
          ))
        ) : (
          <SurfaceCard style={styles.emptyCard}>
            <Ionicons name="analytics-outline" size={24} color={COLORS.textSubtle} />
            <Text style={styles.emptyTitle}>No tracker history yet</Text>
            <Text style={styles.emptyText}>
              Tracker-level reporting will populate after supported protection events are recorded.
            </Text>
          </SurfaceCard>
        )}
        <View style={styles.actions}>
          <Pressable
            testID="export-privacy-report"
            onPress={exportReport}
            style={({ pressed }) => [styles.exportButton, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Ionicons name="download-outline" size={18} color={COLORS.text} />
            <Text style={styles.exportText}>Export Report</Text>
          </Pressable>
          <Pressable
            testID="clear-browsing-data"
            onPress={clearData}
            style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.surfaceMuted} />
            <Text style={styles.clearText}>Clear All Data</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  title: { color: COLORS.text, ...TYPOGRAPHY.headline },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surfaceHigh,
    borderColor: COLORS.secondaryContainer,
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: RADII.full,
    backgroundColor: COLORS.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  heroValue: { color: COLORS.primary, ...TYPOGRAPHY.largeTitleMobile },
  heroLabel: { color: COLORS.text, ...TYPOGRAPHY.body },
  heroCaption: { color: COLORS.textSubtle, ...TYPOGRAPHY.caption, marginTop: SPACING.xs },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.sm,
    marginTop: SPACING.md,
  },
  metricCard: { width: '48%' },
  sectionTitle: {
    color: COLORS.text,
    ...TYPOGRAPHY.headline,
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  chartCard: { paddingBottom: SPACING.md },
  chart: { height: 170, position: 'relative', justifyContent: 'space-between' },
  chartLine: { height: 1, backgroundColor: COLORS.borderSoft, width: '100%' },
  chartBars: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
  },
  barWrap: { alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: SPACING.xs },
  bar: { width: 14, borderRadius: 7, backgroundColor: COLORS.secondary },
  day: { color: COLORS.textMuted, ...TYPOGRAPHY.caption },
  chartNote: { color: COLORS.textSubtle, ...TYPOGRAPHY.footnote, marginTop: SPACING.md },
  trackerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm },
  trackerIcon: {
    width: 36,
    height: 36,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondaryContainer,
  },
  trackerHost: { color: COLORS.text, ...TYPOGRAPHY.callout, flex: 1 },
  trackerCount: { color: COLORS.secondary, ...TYPOGRAPHY.callout },
  emptyCard: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyTitle: { color: COLORS.text, ...TYPOGRAPHY.callout, marginTop: SPACING.sm },
  emptyText: {
    color: COLORS.textMuted,
    ...TYPOGRAPHY.footnote,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  actions: { gap: SPACING.sm, marginTop: SPACING.xl },
  exportButton: {
    height: 54,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  exportText: { color: COLORS.text, ...TYPOGRAPHY.callout },
  clearButton: {
    height: 54,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  clearText: { color: COLORS.surfaceMuted, ...TYPOGRAPHY.callout },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
