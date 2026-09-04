import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton, PrivacyMetricCard, SurfaceCard } from '../components/DesignPrimitives';
import { ScreenContainer } from '../components/ScreenContainer';
import { useBrowserStore } from '../store/browserStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PrivacyDashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { tabs, clearPrivateData } = useBrowserStore();
  const trackerCount = useMemo(
    () => tabs.reduce((total, tab) => total + tab.blockedCount, 0),
    [tabs],
  );
  const clearData = () =>
    Alert.alert(
      'Clear all browsing data?',
      'This clears private tabs and resets the current session. Your settings remain unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all data', style: 'destructive', onPress: clearPrivateData },
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
          <Text style={styles.heroValue}>{trackerCount || '—'}</Text>
          <Text style={styles.heroLabel}>Trackers Blocked</Text>
          <Text style={styles.heroCaption}>CURRENT SESSION</Text>
        </SurfaceCard>
        <View style={styles.metricsGrid}>
          <PrivacyMetricCard
            icon="megaphone-outline"
            value="—"
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
            value="—"
            label="Secure Sites"
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
              {DAYS.map((day) => (
                <View key={day} style={styles.barWrap}>
                  <View
                    style={[styles.bar, { height: day === 'Thu' ? 45 : day === 'Sat' ? 29 : 12 }]}
                  />
                  <Text style={styles.day}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.chartNote}>
            Activity history will appear as protection events are recorded.
          </Text>
        </SurfaceCard>
        <Text style={styles.sectionTitle}>Top Trackers Blocked</Text>
        <SurfaceCard style={styles.emptyCard}>
          <Ionicons name="analytics-outline" size={24} color={COLORS.textSubtle} />
          <Text style={styles.emptyTitle}>No tracker history yet</Text>
          <Text style={styles.emptyText}>
            Tracker-level reporting will populate after supported protection events are recorded.
          </Text>
        </SurfaceCard>
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
