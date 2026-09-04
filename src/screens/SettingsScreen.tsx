import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionLabel, SurfaceCard } from '../components/DesignPrimitives';
import { useBrowserStore } from '../store/browserStore';
import { useSettingsStore } from '../store/settingsStore';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const settings = useSettingsStore();
  const { clearPrivateData } = useBrowserStore();
  const clearData = () =>
    Alert.alert(
      'Clear browsing data?',
      'This removes private tabs and resets the current browsing session.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear data', style: 'destructive', onPress: clearPrivateData },
      ],
    );
  const nextTheme =
    settings.theme === 'dark' ? 'system' : settings.theme === 'system' ? 'light' : 'dark';
  const nextEngine =
    settings.searchEngine === 'DuckDuckGo'
      ? 'Google'
      : settings.searchEngine === 'Google'
        ? 'Bing'
        : 'DuckDuckGo';

  return (
    <ScreenContainer>
      <ScrollView testID="settings-screen" contentContainerStyle={styles.content}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Settings</Text>
            <Text style={styles.pageSubtitle}>Make Probaho work your way</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="options-outline" size={21} color={COLORS.primary} />
          </View>
        </View>

        <SectionLabel>Privacy & Security</SectionLabel>
        <SurfaceCard style={styles.group}>
          <SettingToggle
            icon="megaphone-outline"
            title="Block Ads"
            description="Prevent intrusive advertising"
            value={settings.blockAds}
            onChange={settings.setBlockAds}
          />
          <SettingToggle
            icon="eye-off-outline"
            title="Block Trackers"
            description="Stop third-party scripts from following you"
            value={settings.blockTrackers}
            onChange={settings.setBlockTrackers}
          />
          <SettingToggle
            icon="server-outline"
            title="Block Cookies"
            description="Block third-party cookies"
            value={settings.blockCookies}
            onChange={settings.setBlockCookies}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            title="Secure DNS"
            description={settings.dnsOverHttps ? 'Automatic · enabled' : 'Disabled'}
            onPress={() => settings.setDnsOverHttps(!settings.dnsOverHttps)}
          />
          <SettingRow
            icon="trash-outline"
            title="Clear Browsing Data"
            description="History, cookies, and private tabs"
            danger
            onPress={clearData}
          />
        </SurfaceCard>

        <SectionLabel>Appearance</SectionLabel>
        <SurfaceCard style={styles.group}>
          <SettingRow
            icon="moon-outline"
            title="Theme"
            description={
              settings.theme === 'dark'
                ? 'Dark'
                : settings.theme === 'light'
                  ? 'Light'
                  : 'System default'
            }
            onPress={() => settings.setTheme(nextTheme)}
          />
          <SettingRow
            icon="text-outline"
            title="Font Size"
            description={`${Math.round(settings.fontScale * 100)}%`}
            onPress={() =>
              settings.setFontScale(settings.fontScale >= 1.2 ? 0.9 : settings.fontScale + 0.1)
            }
          />
          <SettingRow
            icon="home-outline"
            title="Home Page"
            description="Probaho Start Page"
            onPress={() => navigation.navigate('Home')}
          />
        </SurfaceCard>

        <SectionLabel>Search</SectionLabel>
        <SurfaceCard style={styles.group}>
          <SettingRow
            icon="search-outline"
            title="Search Engine"
            description={settings.searchEngine}
            onPress={() => settings.setSearchEngine(nextEngine)}
          />
          <SettingToggle
            icon="bulb-outline"
            title="Search Suggestions"
            description="Show suggestions while typing"
            value={settings.searchSuggestions}
            onChange={settings.setSearchSuggestions}
          />
        </SurfaceCard>

        <SectionLabel>Advanced</SectionLabel>
        <SurfaceCard style={styles.group}>
          <SettingRow
            icon="download-outline"
            title="Downloads"
            description="Ask where to save files"
            onPress={() =>
              Alert.alert(
                'Downloads',
                'Download preferences will be available when file downloads are enabled.',
              )
            }
          />
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            description="Manage site permissions"
            onPress={() =>
              Alert.alert(
                'Notifications',
                'Site notification permissions are managed by your device.',
              )
            }
          />
          <SettingRow
            icon="accessibility-outline"
            title="Accessibility"
            description="Text scaling and high contrast"
            onPress={() => settings.setFontScale(settings.fontScale >= 1.2 ? 1 : 1.2)}
          />
        </SurfaceCard>

        <SectionLabel>About</SectionLabel>
        <SurfaceCard style={[styles.group, styles.aboutGroup]}>
          <SettingRow
            icon="information-circle-outline"
            title="Version"
            description="1.0.0 · Mobile preview"
          />
          <SettingRow
            icon="shield-outline"
            title="Privacy Policy"
            description="Read how Probaho handles data"
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'Probaho is designed to keep browsing preferences on your device.',
              )
            }
          />
          <SettingRow
            icon="star-outline"
            title="Rate App"
            description="Share your feedback"
            onPress={() =>
              Alert.alert('Thank you', 'Rating links will be connected before release.')
            }
          />
          <SettingRow
            icon="sparkles-outline"
            title="Replay Onboarding"
            description="Review the privacy-first introduction"
            onPress={() => navigation.navigate('Onboarding')}
          />
        </SurfaceCard>
        <Text style={styles.footer}>Probaho · Transparent security</Text>
      </ScrollView>
    </ScreenContainer>
  );
};

const SettingToggle = ({
  icon,
  title,
  description,
  value,
  onChange,
}: {
  icon: IconName;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <Ionicons name={icon} size={20} color={COLORS.textMuted} />
    </View>
    <View style={styles.rowCopy}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: COLORS.surfaceHighest, true: COLORS.primaryStrong }}
      thumbColor={value ? COLORS.primary : COLORS.textSubtle}
      accessibilityLabel={title}
    />
  </View>
);

const SettingRow = ({
  icon,
  title,
  description,
  onPress,
  danger = false,
}: {
  icon: IconName;
  title: string;
  description?: string;
  onPress?: () => void;
  danger?: boolean;
}) => {
  const content = (
    <>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={danger ? COLORS.danger : COLORS.textMuted} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
        {description && (
          <Text style={[styles.rowDescription, danger && styles.dangerDescription]}>
            {description}
          </Text>
        )}
      </View>
      {onPress && <Ionicons name="chevron-forward" size={18} color={COLORS.textSubtle} />}
    </>
  );
  return onPress ? (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      {content}
    </Pressable>
  ) : (
    <View style={styles.row}>{content}</View>
  );
};

const styles = StyleSheet.create({
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  pageTitle: { color: COLORS.text, ...TYPOGRAPHY.title },
  pageSubtitle: { color: COLORS.textMuted, ...TYPOGRAPHY.footnote, marginTop: 3 },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  group: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm },
  row: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
  },
  rowIcon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, paddingHorizontal: SPACING.sm },
  rowTitle: { color: COLORS.text, ...TYPOGRAPHY.callout },
  rowDescription: { color: COLORS.textMuted, ...TYPOGRAPHY.footnote, marginTop: 2 },
  dangerText: { color: COLORS.danger },
  dangerDescription: { color: 'rgba(255,180,171,0.72)' },
  aboutGroup: { marginBottom: SPACING.lg },
  footer: {
    color: COLORS.textSubtle,
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  pressed: { opacity: 0.72 },
});
