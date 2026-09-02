import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton } from '../components/DesignPrimitives';
import { PrivacyProtectionSheet } from '../components/PrivacyProtectionSheet';
import { ScreenContainer } from '../components/ScreenContainer';
import { URLInput } from '../components/URLInput';
import { WebViewWrapper } from '../components/WebViewWrapper';
import { useBrowserStore } from '../store/browserStore';
import { useSettingsStore } from '../store/settingsStore';

export const BrowserScreen = () => {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);
  const { tabs, activeTabId, isPrivateMode, updateTab } = useBrowserStore();
  const { blockTrackers, blockAds, forceHttps, setBlockTrackers, setBlockAds, setForceHttps } =
    useSettingsStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const [currentUrl, setCurrentUrl] = useState(activeTab?.url || 'https://duckduckgo.com');
  const [progress, setProgress] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (activeTab) setCurrentUrl(activeTab.url);
  }, [activeTabId]);

  if (!activeTab)
    return (
      <ScreenContainer>
        <View />
      </ScreenContainer>
    );

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    updateTab(activeTab.id, {
      url: navState.url,
      title: navState.title || 'New Tab',
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });
  };

  const handleNavigate = (url: string) => {
    setCurrentUrl(url);
    updateTab(activeTab.id, { url });
  };

  const handleProgress = (value: number) => {
    setProgress(value);
    updateTab(activeTab.id, { progress: value });
  };

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <IconButton
            icon="chevron-back"
            label="Go back"
            color={activeTab.canGoBack ? COLORS.text : COLORS.textSubtle}
            onPress={() => activeTab.canGoBack && webViewRef.current?.goBack()}
          />
          <IconButton
            icon="chevron-forward"
            label="Go forward"
            color={activeTab.canGoForward ? COLORS.text : COLORS.textSubtle}
            onPress={() => activeTab.canGoForward && webViewRef.current?.goForward()}
          />
          <View style={styles.addressWrap}>
            <URLInput
              currentUrl={currentUrl}
              isPrivateMode={activeTab.isPrivate || isPrivateMode}
              onNavigate={handleNavigate}
              onReload={() => webViewRef.current?.reload()}
            />
          </View>
          <IconButton
            icon="shield-checkmark-outline"
            label="Open privacy protection"
            color={COLORS.secondary}
            variant="filled"
            onPress={() => setShowPrivacy(true)}
          />
        </View>
        {progress > 0 && progress < 1 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressValue, { width: `${progress * 100}%` }]} />
          </View>
        )}
        <View style={styles.webViewArea}>
          <WebViewWrapper
            ref={webViewRef}
            url={currentUrl}
            isPrivateMode={activeTab.isPrivate || isPrivateMode}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadProgress={handleProgress}
          />
          {progress > 0 && progress < 0.1 && (
            <View style={styles.loadingPill}>
              <Ionicons name="lock-closed-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.loadingText}>Connecting securely</Text>
            </View>
          )}
        </View>
        <View style={styles.bottomBar}>
          <IconButton
            icon="home-outline"
            label="Go to home"
            onPress={() => navigation.navigate('Home')}
          />
          <IconButton
            icon="refresh-outline"
            label="Reload page"
            onPress={() => webViewRef.current?.reload()}
          />
          <Pressable
            onPress={() => navigation.navigate('Tabs')}
            style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`${tabs.length} open tabs`}
          >
            <Ionicons name="copy-outline" size={22} color={COLORS.text} />
            <Text style={styles.tabCount}>{tabs.length}</Text>
          </Pressable>
          <IconButton
            icon="ellipsis-horizontal"
            label="Open browser menu"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>
      <PrivacyProtectionSheet
        visible={showPrivacy}
        url={currentUrl}
        blockedCount={activeTab.blockedCount}
        blockTrackers={blockTrackers}
        blockAds={blockAds}
        forceHttps={forceHttps}
        isPrivateMode={activeTab.isPrivate || isPrivateMode}
        onClose={() => setShowPrivacy(false)}
        onToggleTrackers={setBlockTrackers}
        onToggleAds={setBlockAds}
        onToggleHttps={setForceHttps}
        onReport={() => {
          setShowPrivacy(false);
          navigation.navigate('PrivacyDashboard');
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.xs,
  },
  addressWrap: { flex: 1, minWidth: 0 },
  progressTrack: { height: 2, backgroundColor: COLORS.surfaceHigh },
  progressValue: { height: 2, backgroundColor: COLORS.secondary },
  webViewArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  loadingPill: {
    position: 'absolute',
    top: SPACING.md,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceHigh,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.full,
  },
  loadingText: { color: COLORS.textMuted, ...TYPOGRAPHY.caption },
  bottomBar: {
    minHeight: 60,
    backgroundColor: COLORS.surfaceMuted,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: SPACING.xs,
  },
  tabButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.full,
  },
  tabCount: {
    position: 'absolute',
    minWidth: 15,
    height: 15,
    borderRadius: RADII.full,
    right: 4,
    top: 2,
    backgroundColor: COLORS.secondary,
    color: COLORS.surfaceMuted,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
  },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});
