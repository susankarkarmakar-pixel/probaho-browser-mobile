import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../constants/theme';
import { useBrowserStore } from '../store/browserStore';

import { AppNavigationProp } from '../../App';

export const TabsScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const {
    tabs,
    activeTabId,
    isPrivateMode,
    addTab,
    closeTab,
    setActiveTab,
    setPrivateMode,
    clearPrivateData,
  } = useBrowserStore();

  const handleTabPress = (id: string) => {
    setActiveTab(id);
    navigation.navigate('Browser');
  };

  const handleNewTab = () => {
    addTab('https://duckduckgo.com');
    navigation.navigate('Browser');
  };

  const togglePrivateMode = () => {
    const newValue = !isPrivateMode;
    if (!newValue) {
      clearPrivateData(); // Clear data *before* updating state flag
    }
    setPrivateMode(newValue);
  };

  const backgroundColor = isPrivateMode ? COLORS.privateBackground : COLORS.background.light;
  const textColor = isPrivateMode ? COLORS.privateText : COLORS.text.light;
  const itemBackground = isPrivateMode ? '#3A3A3C' : '#F2F2F7';

  const renderItem = ({ item }: { item: { id: string; title: string; url: string } }) => {
    const isActive = item.id === activeTabId;
    return (
      <TouchableOpacity
        style={[
          styles.tabItem,
          { backgroundColor: itemBackground },
          isActive && styles.activeTabItem,
        ]}
        onPress={() => handleTabPress(item.id)}
      >
        <View style={styles.tabInfo}>
          <Text style={[styles.tabTitle, { color: textColor }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.tabUrl, { color: '#8E8E93' }]} numberOfLines={1}>
            {item.url}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => closeTab(item.id)}>
          <Ionicons name="close" size={20} color={textColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {tabs.length} {tabs.length === 1 ? 'Tab' : 'Tabs'}
        </Text>
        <TouchableOpacity onPress={togglePrivateMode} style={styles.privateBtn}>
          <Ionicons
            name={isPrivateMode ? 'shield' : 'shield-outline'}
            size={24}
            color={isPrivateMode ? COLORS.privateText : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tabs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={[styles.fab, isPrivateMode && styles.privateFab]}
        onPress={handleNewTab}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    ...TYPOGRAPHY.header,
  },
  privateBtn: {
    padding: 8,
  },
  list: {
    padding: 16,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activeTabItem: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  tabInfo: {
    flex: 1,
  },
  tabTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  tabUrl: {
    ...TYPOGRAPHY.small,
  },
  closeBtn: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  privateFab: {
    backgroundColor: '#3A3A3C',
    borderWidth: 1,
    borderColor: '#C6C6C8',
  },
});
