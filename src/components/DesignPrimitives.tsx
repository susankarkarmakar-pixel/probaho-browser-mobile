import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, SHADOWS, SPACING, TYPOGRAPHY, QUICK_LINKS } from '../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type SurfaceCardProps = {
  children: React.ReactNode;
  style?: object;
  accent?: string;
};

export const SurfaceCard = ({ children, style, accent }: SurfaceCardProps) => (
  <View style={[styles.card, accent ? { borderColor: accent } : null, style]}>{children}</View>
);

type IconButtonProps = {
  icon: IconName;
  onPress: () => void;
  label: string;
  color?: string;
  size?: number;
  variant?: 'plain' | 'filled' | 'outlined';
};

export const IconButton = ({
  icon,
  onPress,
  label,
  color = COLORS.text,
  size = 22,
  variant = 'plain',
}: IconButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={({ pressed }) => [
      styles.iconButton,
      styles[`iconButton_${variant}`],
      pressed && styles.pressed,
    ]}
  >
    <Ionicons name={icon} size={size} color={color} />
  </Pressable>
);

export const QuickLinkGrid = ({ onSelect }: { onSelect: (query: string) => void }) => (
  <View style={styles.quickGrid}>
    {QUICK_LINKS.map((link) => (
      <Pressable
        key={link.label}
        accessibilityRole="button"
        accessibilityLabel={link.label}
        onPress={() => onSelect(link.query)}
        style={({ pressed }) => [styles.quickLink, pressed && styles.pressed]}
      >
        <View style={styles.quickIcon}>
          <Ionicons name={link.icon} size={24} color={COLORS.text} />
        </View>
        <Text style={styles.quickLabel}>{link.label}</Text>
      </Pressable>
    ))}
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add quick link"
      onPress={() => onSelect('')}
      style={({ pressed }) => [styles.quickLink, pressed && styles.pressed]}
    >
      <View style={styles.quickIcon}>
        <Ionicons name="add" size={25} color={COLORS.text} />
      </View>
      <Text style={styles.quickLabel}>Add</Text>
    </Pressable>
  </View>
);

type MetricProps = {
  icon: IconName;
  value: string;
  label: string;
  accent?: string;
  large?: boolean;
  style?: object;
};
export const PrivacyMetricCard = ({
  icon,
  value,
  label,
  accent = COLORS.primary,
  large = false,
  style,
}: MetricProps) => (
  <SurfaceCard style={[large ? styles.heroMetric : styles.metricCard, style]}>
    <View style={[styles.metricIcon, { backgroundColor: `${accent}22` }]}>
      <Ionicons name={icon} size={large ? 25 : 19} color={accent} />
    </View>
    <Text style={[large ? TYPOGRAPHY.largeTitleMobile : TYPOGRAPHY.title, styles.metricValue]}>
      {value}
    </Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </SurfaceCard>
);

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.full,
  },
  iconButton_plain: { backgroundColor: COLORS.transparent },
  iconButton_filled: { backgroundColor: COLORS.surfaceHigh },
  iconButton_outlined: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACING.md,
  },
  quickLink: { alignItems: 'center', width: '23%' },
  quickIcon: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  quickLabel: { color: COLORS.textMuted, ...TYPOGRAPHY.caption, marginTop: SPACING.xs },
  heroMetric: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surfaceHigh,
    borderColor: COLORS.secondaryContainer,
  },
  metricCard: { minHeight: 115, justifyContent: 'center' },
  metricIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.full,
    marginBottom: SPACING.sm,
  },
  metricValue: { color: COLORS.text, fontWeight: '700' as const },
  metricLabel: { color: COLORS.textMuted, ...TYPOGRAPHY.subhead, marginTop: 2 },
  sectionLabel: {
    color: COLORS.primary,
    ...TYPOGRAPHY.subhead,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
});
