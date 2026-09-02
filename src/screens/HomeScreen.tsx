import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { useBrowserStore } from '../store/browserStore';
import { normalizeUrl } from '../utils/urlHelper';

const QUICK_LINKS = [
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: 'search' },
  { name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'book' },
  { name: 'GitHub', url: 'https://github.com', icon: 'logo-github' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'newspaper' },
];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { isPrivateMode, addTab } = useBrowserStore();
  const [searchQuery, setSearchQuery] = useState('');

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

  const backgroundColor = isPrivateMode ? COLORS.privateBackground : COLORS.background.light;
  const textColor = isPrivateMode ? COLORS.privateText : COLORS.text.light;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Ionicons
          name="shield-checkmark"
          size={48}
          color={isPrivateMode ? COLORS.privateText : COLORS.primary}
        />
        <Text style={[styles.title, { color: textColor }]}>
          {isPrivateMode ? 'Private Browsing' : 'Probaho Browser'}
        </Text>
        {isPrivateMode && (
          <Text style={styles.subtitle}>
            Your history, cookies, and cache will be cleared when you close this tab.
          </Text>
        )}
      </View>

      <View
        style={[styles.searchContainer, isPrivateMode ? styles.privateSearch : styles.lightSearch]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isPrivateMode ? '#999' : '#666'}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search or enter website"
          placeholderTextColor={isPrivateMode ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Links</Text>

      <View style={styles.grid}>
        {QUICK_LINKS.map((link) => (
          <TouchableOpacity
            key={link.url}
            style={[styles.card, { backgroundColor: isPrivateMode ? '#3A3A3C' : '#F2F2F7' }]}
            onPress={() => handleQuickLink(link.url)}
          >
            <Ionicons name={link.icon as any} size={24} color={textColor} />
            <Text style={[styles.cardText, { color: textColor }]}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    ...TYPOGRAPHY.header,
    marginTop: 16,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  lightSearch: {
    backgroundColor: COLORS.omnibox.light,
  },
  privateSearch: {
    backgroundColor: COLORS.omnibox.dark,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  sectionTitle: {
    ...TYPOGRAPHY.header,
    fontSize: 18,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardText: {
    ...TYPOGRAPHY.body,
    marginTop: 8,
    fontWeight: '500',
  },
});
