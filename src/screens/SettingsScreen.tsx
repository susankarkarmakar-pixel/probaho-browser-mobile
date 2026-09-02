import React from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';
import { useBrowserStore } from '../store/browserStore';

export const SettingsScreen = () => {
  const { isPrivateMode } = useBrowserStore();
  const { blockTrackers, dnsOverHttps, theme, setBlockTrackers, setDnsOverHttps, setTheme } =
    useSettingsStore();

  const backgroundColor = isPrivateMode ? COLORS.privateBackground : COLORS.background.light;
  const textColor = isPrivateMode ? COLORS.privateText : COLORS.text.light;
  const itemBackground = isPrivateMode ? '#3A3A3C' : '#F2F2F7';

  const SettingToggle = ({ title, description, value, onValueChange }: any) => (
    <View style={[styles.settingItem, { backgroundColor: itemBackground }]}>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
        <Text style={[styles.settingDescription, { color: '#8E8E93' }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: COLORS.primary }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Privacy & Security</Text>

        <SettingToggle
          title="Block Trackers & Ads"
          description="Prevent sites from tracking your activity"
          value={blockTrackers}
          onValueChange={setBlockTrackers}
        />

        <SettingToggle
          title="DNS over HTTPS"
          description="Encrypt your DNS requests for added privacy"
          value={dnsOverHttps}
          onValueChange={setDnsOverHttps}
        />

        <Text style={[styles.sectionTitle, { color: textColor, marginTop: 24 }]}>Appearance</Text>

        <View style={[styles.settingItem, { backgroundColor: itemBackground }]}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, { color: textColor }]}>Theme</Text>
            <Text style={[styles.settingDescription, { color: '#8E8E93' }]}>Current: {theme}</Text>
          </View>
          <View style={styles.themeOptions}>
            {['light', 'dark', 'system'].map((t) => (
              <Text
                key={t}
                style={[
                  styles.themeOptionText,
                  { color: theme === t ? COLORS.primary : '#8E8E93' },
                ]}
                onPress={() => setTheme(t as any)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            ))}
          </View>
        </View>

        <Text style={[styles.aboutText, { color: '#8E8E93' }]}>Probaho Browser Mobile v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.header,
    fontSize: 18,
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    ...TYPOGRAPHY.small,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOptionText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
  },
  aboutText: {
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
});
