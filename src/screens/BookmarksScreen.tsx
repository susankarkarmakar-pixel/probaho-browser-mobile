import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, GEOMETRY } from '../constants/theme';
import { useBookmarksStore } from '../store/bookmarksStore';
import { AppNavigationProp } from '../../App';

export const BookmarksScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { folders, recentBookmarks } = useBookmarksStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add" size={24} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bookmarks"
            placeholderTextColor={COLORS.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>FOLDERS</Text>
        <View style={styles.listContainer}>
          {folders.map((folder, index) => (
            <TouchableOpacity
              key={folder.id}
              style={[styles.listItem, index !== folders.length - 1 && styles.borderBottom]}
            >
              <View
                style={[styles.folderIconContainer, { backgroundColor: folder.backgroundColor }]}
              >
                <Ionicons
                  name={folder.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={folder.color}
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>{folder.name}</Text>
                <Text style={styles.itemSubtitle}>{folder.itemText}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>RECENT</Text>
          <TouchableOpacity>
            <Ionicons name="filter" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.recentListContainer}>
          {recentBookmarks.map((bookmark) => (
            <TouchableOpacity key={bookmark.id} style={styles.recentListItem}>
              <View style={styles.bookmarkIconContainer}>
                <Ionicons
                  name={
                    bookmark.iconType === 'github'
                      ? 'logo-github'
                      : bookmark.iconType === 'youtube'
                        ? 'logo-youtube'
                        : 'globe-outline'
                  }
                  size={20}
                  color={COLORS.text.secondary}
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {bookmark.title}
                </Text>
                <Text style={styles.itemSubtitle} numberOfLines={1}>
                  {bookmark.domain}
                </Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text.secondary} />
              </TouchableOpacity>
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
    backgroundColor: COLORS.background.light, // Top header area is white in design
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#433C4F', // Dark purple header background from image
  },
  headerTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.primary, // Lavender text
  },
  iconButton: {
    padding: 8,
  },
  container: {
    padding: 16,
    backgroundColor: COLORS.background.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: COLORS.background.surface1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.text.primary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
    color: '#B0A7BC', // Muted lavender-gray
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  listContainer: {
    backgroundColor: COLORS.background.surface1,
    borderRadius: GEOMETRY.radius.cards,
    marginBottom: 24,
  },
  recentListContainer: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  recentListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background.surface1,
    borderRadius: GEOMETRY.radius.cards,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  folderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookmarkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.background.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  itemSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.text.secondary,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
});
