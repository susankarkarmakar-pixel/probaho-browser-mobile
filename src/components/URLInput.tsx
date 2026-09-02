import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { normalizeUrl, getDomainFromUrl } from '../utils/urlHelper';

interface URLInputProps {
  currentUrl: string;
  isPrivateMode: boolean;
  onNavigate: (url: string) => void;
  onReload?: () => void;
}

export const URLInput: React.FC<URLInputProps> = ({
  currentUrl,
  isPrivateMode,
  onNavigate,
  onReload,
}) => {
  const [input, setInput] = useState(currentUrl);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setInput(currentUrl);
    }
  }, [currentUrl, isEditing]);

  const handleSubmit = () => {
    setIsEditing(false);
    const newUrl = normalizeUrl(input);
    onNavigate(newUrl);
  };

  const getDisplayValue = () => {
    if (isEditing) return input;
    if (currentUrl === 'about:blank' || currentUrl.startsWith('https://duckduckgo.com')) {
      return '';
    }
    return getDomainFromUrl(currentUrl);
  };

  return (
    <View
      style={[styles.container, isPrivateMode ? styles.privateContainer : styles.lightContainer]}
    >
      <Ionicons
        name={isPrivateMode ? 'shield' : 'lock-closed'}
        size={16}
        color={isPrivateMode ? COLORS.privateText : COLORS.text.light}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, isPrivateMode ? styles.privateInput : styles.lightInput]}
        value={isEditing ? input : getDisplayValue()}
        onChangeText={setInput}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
          setIsEditing(false);
          setInput(currentUrl);
        }}
        onSubmitEditing={handleSubmit}
        placeholder="Search or enter website"
        placeholderTextColor={isPrivateMode ? '#999' : '#666'}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="go"
        selectTextOnFocus
      />
      {!isEditing && onReload && (
        <TouchableOpacity onPress={onReload} style={styles.reloadBtn}>
          <Ionicons
            name="refresh"
            size={20}
            color={isPrivateMode ? COLORS.privateText : COLORS.text.light}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  lightContainer: {
    backgroundColor: COLORS.omnibox.light,
  },
  privateContainer: {
    backgroundColor: COLORS.omnibox.dark,
    borderWidth: 1,
    borderColor: COLORS.darkBorder,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  lightInput: {
    color: COLORS.text.light,
  },
  privateInput: {
    color: COLORS.privateText,
  },
  icon: {
    marginRight: 4,
  },
  reloadBtn: {
    padding: 4,
  },
});
