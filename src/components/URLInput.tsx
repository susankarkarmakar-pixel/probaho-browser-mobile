import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { getDomainFromUrl, normalizeUrl } from '../utils/urlHelper';

type URLInputProps = {
  currentUrl: string;
  isPrivateMode: boolean;
  onNavigate: (url: string) => void;
  onReload?: () => void;
};

export const URLInput = ({ currentUrl, isPrivateMode, onNavigate, onReload }: URLInputProps) => {
  const [input, setInput] = useState(currentUrl);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (!isEditing) setInput(currentUrl);
  }, [currentUrl, isEditing]);
  const submit = () => {
    setIsEditing(false);
    onNavigate(normalizeUrl(input));
  };
  const displayValue = isEditing
    ? input
    : currentUrl === 'about:blank' || currentUrl.includes('duckduckgo.com')
      ? ''
      : getDomainFromUrl(currentUrl);
  return (
    <View style={[styles.container, isPrivateMode && styles.privateContainer]}>
      <Ionicons
        name={isPrivateMode ? 'eye-off-outline' : 'shield-checkmark-outline'}
        size={18}
        color={isPrivateMode ? COLORS.primary : COLORS.secondary}
      />
      <TextInput
        style={styles.input}
        value={displayValue}
        onChangeText={setInput}
        onFocus={() => {
          setIsEditing(true);
          setInput(currentUrl);
        }}
        onBlur={() => setIsEditing(false)}
        onSubmitEditing={submit}
        placeholder="Search or enter address"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="go"
        selectTextOnFocus
        accessibilityLabel="Search or enter web address"
      />
      {!isEditing && onReload && (
        <TouchableOpacity
          onPress={onReload}
          style={styles.reload}
          accessibilityRole="button"
          accessibilityLabel="Reload page"
        >
          <Ionicons name="refresh-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: RADII.xl,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    marginHorizontal: SPACING.xs,
  },
  privateContainer: {
    backgroundColor: COLORS.privateSurface,
    borderColor: COLORS.primaryContainer,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    ...TYPOGRAPHY.subhead,
    minWidth: 0,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 0,
  },
  reload: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
