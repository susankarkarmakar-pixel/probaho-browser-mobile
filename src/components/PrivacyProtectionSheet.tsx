import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { getDomainFromUrl } from '../utils/urlHelper';

type PrivacyProtectionSheetProps = {
  visible: boolean;
  url: string;
  blockedCount: number;
  blockTrackers: boolean;
  blockAds: boolean;
  forceHttps: boolean;
  isPrivateMode: boolean;
  onClose: () => void;
  onToggleTrackers: (value: boolean) => void;
  onToggleAds: (value: boolean) => void;
  onToggleHttps: (value: boolean) => void;
  onReport: () => void;
};

export const PrivacyProtectionSheet = ({
  visible,
  url,
  blockedCount,
  blockTrackers,
  blockAds,
  forceHttps,
  isPrivateMode,
  onClose,
  onToggleTrackers,
  onToggleAds,
  onToggleHttps,
  onReport,
}: PrivacyProtectionSheetProps) => {
  const domain = getDomainFromUrl(url);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          style={styles.dismissArea}
          onPress={onClose}
          accessibilityLabel="Close privacy protection"
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <View style={styles.shield}>
                <Ionicons name="shield-checkmark" size={23} color={COLORS.secondary} />
              </View>
              <Text style={styles.title}>Privacy{`\n`}Protection</Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close privacy protection"
              style={styles.close}
            >
              <Ionicons name="close" size={25} color={COLORS.text} />
            </Pressable>
          </View>
          <View style={styles.metricPanel}>
            <Text style={[styles.metricNumber, blockedCount === 0 && styles.metricUnknown]}>
              {blockedCount > 0 ? blockedCount : '—'}
            </Text>
            <Text style={styles.metricCaption}>TRACKERS BLOCKED</Text>
            <Text style={styles.domain}>{domain || 'Current site'}</Text>
          </View>
          <PrivacyToggle
            icon="eye-off-outline"
            title="Block Trackers"
            detail="Cross-site tracking prevention"
            value={blockTrackers}
            onValueChange={onToggleTrackers}
          />
          <PrivacyToggle
            icon="megaphone-outline"
            title="Block Ads"
            detail="Intrusive advertising hidden"
            value={blockAds}
            onValueChange={onToggleAds}
          />
          <PrivacyToggle
            icon="lock-closed-outline"
            title="Force HTTPS"
            detail={forceHttps ? 'Secure connection preferred' : 'Connection preference off'}
            value={forceHttps}
            onValueChange={onToggleHttps}
          />
          {isPrivateMode && (
            <Text style={styles.privateNote}>
              Private mode is active. This tab uses an isolated browsing session.
            </Text>
          )}
          <Pressable
            onPress={onReport}
            style={({ pressed }) => [styles.reportButton, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Ionicons name="bar-chart-outline" size={18} color={COLORS.text} />
            <Text style={styles.reportText}>View Detailed Report</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const PrivacyToggle = ({
  icon,
  title,
  detail,
  value,
  onValueChange,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  detail: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textMuted} />
    </View>
    <View style={styles.toggleCopy}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Text style={styles.toggleDetail}>{detail}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.surfaceHighest, true: COLORS.primaryStrong }}
      thumbColor={value ? COLORS.primary : COLORS.textSubtle}
      accessibilityLabel={title}
    />
  </View>
);

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.64)' },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: COLORS.surfaceHigh,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    padding: SPACING.lg,
    paddingBottom: 32,
    ...SHADOWS.sheet,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textSubtle,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  shield: {
    width: 42,
    height: 42,
    borderRadius: RADII.full,
    backgroundColor: COLORS.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: COLORS.text, ...TYPOGRAPHY.title },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  metricPanel: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADII.lg,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  metricNumber: { color: COLORS.danger, fontSize: 44, lineHeight: 50, fontWeight: '700' },
  metricUnknown: { color: COLORS.textSubtle },
  metricCaption: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, marginTop: 2 },
  domain: {
    color: COLORS.textMuted,
    ...TYPOGRAPHY.footnote,
    marginTop: SPACING.sm,
    maxWidth: '90%',
  },
  toggleRow: {
    minHeight: 64,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  toggleCopy: { flex: 1, paddingHorizontal: SPACING.sm },
  toggleTitle: { color: COLORS.text, ...TYPOGRAPHY.callout },
  toggleDetail: { color: COLORS.textMuted, ...TYPOGRAPHY.footnote, marginTop: 2 },
  privateNote: { color: COLORS.primary, ...TYPOGRAPHY.footnote, marginVertical: SPACING.sm },
  reportButton: {
    height: 52,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surfaceHighest,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  reportText: { color: COLORS.text, ...TYPOGRAPHY.callout },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});
