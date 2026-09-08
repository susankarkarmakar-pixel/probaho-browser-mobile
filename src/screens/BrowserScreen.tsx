import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import { COLORS, RADII, SPACING, TYPOGRAPHY } from '../constants/theme';
import { IconButton } from '../components/DesignPrimitives';
import { PrivacyProtectionSheet } from '../components/PrivacyProtectionSheet';
import { ScreenContainer } from '../components/ScreenContainer';
import { URLInput } from '../components/URLInput';
import { WebViewWrapper } from '../components/WebViewWrapper';
import type { PrivacyDecision } from '../privacy/privacyEngine';
import { useBrowserStore } from '../store/browserStore';
import { useLibraryStore } from '../store/libraryStore';
import { usePrivacyStore } from '../store/privacyStore';
import { useSettingsStore } from '../store/settingsStore';

export const BrowserScreen = () => {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);
  const { tabs, activeTabId, isPrivateMode, updateTab } = useBrowserStore();
  const { addHistory, addBookmark, addReadingList } = useLibraryStore();
  const { recordDecision } = usePrivacyStore();
  const { blockTrackers, blockAds, forceHttps, setBlockTrackers, setBlockAds, setForceHttps } =
    useSettingsStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const [currentUrl, setCurrentUrl] = useState(activeTab?.url || 'https://duckduckgo.com');
  const [progress, setProgress] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab) {
      setCurrentUrl(activeTab.url);
      setErrorMessage(null);
      setProgress(0);
    }
  }, [activeTabId, activeTab?.url]);

  if (!activeTab) {
    return (
      <ScreenContainer>
        <View />
      </ScreenContainer>
    );
  }

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);
    setErrorMessage(null);
    updateTab(activeTab.id, {
      url: navState.url,
      title: navState.title || 'New Tab',
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });
    if (!activeTab.isPrivate && !isPrivateMode && /^https?:\/\//i.test(navState.url)) {
      addHistory({ url: navState.url, title: navState.title || 'New Tab' });
    }
  };

  const handleNavigate = (url: string) => {
    setCurrentUrl(url);
    setErrorMessage(null);
    updateTab(activeTab.id, { url });
  };

  const handleProgress = (value: number) => {
    setProgress(value);
    updateTab(activeTab.id, { progress: value });
  };

  const handlePrivacyDecision = (decision: PrivacyDecision) => {
    recordDecision(decision);
    if (decision.action === 'block') {
      updateTab(activeTab.id, { blockedCount: activeTab.blockedCount + 1 });
    }
  };

  return (
    <ScreenContainer>
      <View testID="browser-screen" style={styles.screen}>
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
            testID="open-privacy-protection"
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
            onNavigationRequest={handleNavigate}
            onPrivacyDecision={handlePrivacyDecision}
            onLoadProgress={handleProgress}
            onWebViewError={setErrorMessage}
          />
          {progress > 0 && progress < 0.1 && !errorMessage && (
            <View style={styles.loadingPill}>
              <Ionicons name="lock-closed-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.loadingText}>Connecting securely</Text>
            </View>
          )}
          {errorMessage && (
            <View testID="browser-error-state" style={styles.errorOverlay}>
              <View style={styles.errorIcon}>
                <Ionicons name="cloud-offline-outline" size={28} color={COLORS.secondary} />
              </View>
              <Text style={styles.errorTitle}>This page could not load</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <View style={styles.errorActions}>
                <Pressable
                  testID="retry-browser-page"
                  onPress={() => {
                    setErrorMessage(null);
                    webViewRef.current?.reload();
                  }}
                  style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate('Home')}
                  style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <Text style={styles.homeText}>Go home</Text>
                </Pressable>
              </View>
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
            testID="open-tabs-from-browser"
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
            onPress={() =>
              Alert.alert('Page actions', activeTab.title || currentUrl, [
                {
                  text: 'Add bookmark',
                  onPress: () =>
                    addBookmark({ url: currentUrl, title: activeTab.title || currentUrl }),
                },
                {
                  text: 'Save to reading list',
                  onPress: () =>
                    addReadingList({ url: currentUrl, title: activeTab.title || currentUrl }),
                },
                { text: 'Open settings', onPress: () => navigation.navigate('Settings') },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
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
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorIcon: {
    width: 62,
    height: 62,
    borderRadius: RADII.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.privateSurface,
  },
  errorTitle: {
    color: COLORS.text,
    ...TYPOGRAPHY.headline,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.textMuted,
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  errorActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  retryText: { color: COLORS.surfaceMuted, ...TYPOGRAPHY.callout },
  homeButton: {
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  homeText: { color: COLORS.text, ...TYPOGRAPHY.callout },
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
