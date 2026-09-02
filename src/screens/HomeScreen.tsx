import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, GEOMETRY } from '../constants/theme';
import { useBrowserStore } from '../store/browserStore';
import { useSettingsStore } from '../store/settingsStore';
import { normalizeUrl } from '../utils/urlHelper';
import { AppNavigationProp } from '../../App';

const QUICK_LINKS = [
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: 'search' },
  { name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'book' },
  { name: 'GitHub', url: 'https://github.com', icon: 'logo-github' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'newspaper' },
];

export const HomeScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isPrivateMode, addTab, tabs } = useBrowserStore();
  const { blockTrackers, dnsOverHttps } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleQuickLink = (url: string) => {
    addTab(url);
    navigation.navigate('Browser');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addTab(normalizeUrl(searchQuery));
      setSearchQuery('');
      navigation.navigate('Browser');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.title}>{isPrivateMode ? 'Private Session' : 'Ready to browse'}</Text>
        </View>

        {/* Omnibox */}
        <View style={[styles.searchContainer, isPrivateMode && styles.privateSearch]}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or enter website"
            placeholderTextColor={COLORS.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="go"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Privacy Summary Card */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.secondary} />
            <Text style={styles.privacyTitle}>Privacy Overview</Text>
          </View>
          <View style={styles.privacyMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{blockTrackers ? 'Active' : 'Off'}</Text>
              <Text style={styles.metricLabel}>Tracker Blocker</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{dnsOverHttps ? 'Active' : 'Off'}</Text>
              <Text style={styles.metricLabel}>Secure DNS</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{tabs.length}</Text>
              <Text style={styles.metricLabel}>Open Tabs</Text>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.grid}>
          {QUICK_LINKS.map((link) => (
            <TouchableOpacity
              key={link.url}
              style={[styles.card, isPrivateMode && styles.privateCard]}
              onPress={() => handleQuickLink(link.url)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons
                  name={link.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={COLORS.text.primary}
                />
              </View>
              <Text style={styles.cardText}>{link.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.main,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 24,
    marginBottom: 32,
  },
  greeting: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.header,
    color: COLORS.text.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // Accessible touch target height
    backgroundColor: COLORS.omnibox.main,
    borderRadius: GEOMETRY.radius.omnibox,
    paddingHorizontal: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  privateSearch: {
    borderColor: COLORS.secondary,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.text.primary,
  },
  privacyCard: {
    backgroundColor: COLORS.background.surface1,
    borderRadius: GEOMETRY.radius.containers,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  privacyTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  privacyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background.surface2,
    borderRadius: GEOMETRY.radius.cards,
    padding: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    ...TYPOGRAPHY.header,
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 4,
  },
  metricLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.header,
    fontSize: 18,
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.background.surface1,
    padding: 16,
    borderRadius: GEOMETRY.radius.cards,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100, // Make sure cards are large enough
  },
  privateCard: {
    backgroundColor: COLORS.background.surface2,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
});
