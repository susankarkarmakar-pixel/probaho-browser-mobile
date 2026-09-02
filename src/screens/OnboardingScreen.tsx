import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';

const PAGES = [
  {
    icon: 'shield-checkmark-outline' as const,
    kicker: 'Transparent security',
    title: 'Browse privately',
    body: 'Your data stays yours. Probaho blocks trackers and intrusive ads by default.',
  },
  {
    icon: 'flash-outline' as const,
    kicker: 'Focused performance',
    title: 'Move with confidence',
    body: 'A clean browser surface keeps the web in focus while privacy controls stay one tap away.',
  },
  {
    icon: 'options-outline' as const,
    kicker: 'Always in control',
    title: 'Protection that explains itself',
    body: 'See what is protected, adjust preferences, and clear your session whenever you choose.',
  },
];

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const { setOnboardingCompleted } = useSettingsStore();
  const [index, setIndex] = useState(0);
  const page = PAGES[index];
  const finish = () => {
    setOnboardingCompleted(true);
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.brand}>Probaho</Text>
        <Pressable onPress={finish} accessibilityRole="button">
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
      </View>
      <View style={styles.illustration}>
        <View style={styles.glow} />
        <View style={styles.illustrationPanel}>
          <Ionicons name={page.icon} size={86} color={COLORS.secondary} />
          <View style={styles.orbitOne} />
          <View style={styles.orbitTwo} />
          <View style={styles.illustrationTag}>
            <Text style={styles.tagText}>{page.kicker}</Text>
          </View>
        </View>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>
      </View>
      <View style={styles.bottom}>
        <View style={styles.dots}>
          {PAGES.map((item, dotIndex) => (
            <View key={item.title} style={[styles.dot, index === dotIndex && styles.dotActive]} />
          ))}
        </View>
        <Pressable
          onPress={index === PAGES.length - 1 ? finish : () => setIndex(index + 1)}
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.nextText}>
            {index === PAGES.length - 1 ? 'Start browsing' : 'Next'}
          </Text>
          <Ionicons
            name={index === PAGES.length - 1 ? 'arrow-forward' : 'chevron-forward'}
            size={20}
            color={COLORS.surfaceMuted}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surfaceMuted, padding: SPACING.lg, paddingTop: 56 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: COLORS.primary, fontSize: 20, fontWeight: '700' },
  skip: { color: COLORS.textMuted, ...TYPOGRAPHY.subhead, padding: SPACING.sm },
  illustration: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(124,58,237,0.18)',
  },
  illustrationPanel: {
    width: 260,
    height: 260,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orbitOne: {
    position: 'absolute',
    width: 206,
    height: 100,
    borderRadius: 103,
    borderWidth: 1,
    borderColor: 'rgba(76,215,246,0.42)',
    transform: [{ rotate: '28deg' }],
  },
  orbitTwo: {
    position: 'absolute',
    width: 100,
    height: 206,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(211,187,255,0.42)',
    transform: [{ rotate: '28deg' }],
  },
  illustrationTag: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.full,
  },
  tagText: { color: COLORS.textMuted, ...TYPOGRAPHY.caption },
  copy: { alignItems: 'center', paddingHorizontal: SPACING.sm, marginBottom: SPACING.xl },
  title: {
    color: COLORS.text,
    ...TYPOGRAPHY.largeTitleMobile,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  body: {
    color: COLORS.textMuted,
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 25,
  },
  bottom: { paddingBottom: SPACING.sm },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.surfaceHighest },
  dotActive: { width: 40, backgroundColor: COLORS.primary },
  nextButton: {
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: RADII.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  nextText: { color: COLORS.surfaceMuted, fontSize: 18, fontWeight: '700' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
