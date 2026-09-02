import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { URLInput } from '../components/URLInput';
import { WebViewWrapper } from '../components/WebViewWrapper';
import { useBrowserStore } from '../store/browserStore';
import { COLORS } from '../constants/theme';

export const BrowserScreen = () => {
  const webViewRef = useRef<WebView>(null);
  const { tabs, activeTabId, isPrivateMode, updateTab } = useBrowserStore();
  const [progress, setProgress] = useState(0);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const [currentUrl, setCurrentUrl] = useState(activeTab?.url || 'https://duckduckgo.com');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (activeTab && activeTab.url !== currentUrl) {
      setCurrentUrl(activeTab.url);
    }
  }, [activeTabId]); // Only when active tab changes, not on every URL update

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);

    if (activeTabId && navState.title) {
      updateTab(activeTabId, { url: navState.url, title: navState.title });
    }
  };

  const handleNavigate = (url: string) => {
    setCurrentUrl(url);
    if (activeTabId) {
      updateTab(activeTabId, { url });
    }
  };

  const handleReload = () => {
    webViewRef.current?.reload();
  };

  const goBack = () => {
    if (canGoBack) webViewRef.current?.goBack();
  };

  const goForward = () => {
    if (canGoForward) webViewRef.current?.goForward();
  };

  const backgroundColor = isPrivateMode ? COLORS.privateBackground : COLORS.background.light;
  const iconColor = isPrivateMode ? COLORS.privateText : COLORS.text.light;

  if (!activeTab) {
    return <View style={[styles.container, { backgroundColor }]} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} disabled={!canGoBack} style={styles.navButton}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={canGoBack ? iconColor : COLORS.inactiveText}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={goForward} disabled={!canGoForward} style={styles.navButton}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={canGoForward ? iconColor : COLORS.inactiveText}
          />
        </TouchableOpacity>
        <View style={styles.urlInputContainer}>
          <URLInput
            currentUrl={currentUrl}
            isPrivateMode={isPrivateMode}
            onNavigate={handleNavigate}
            onReload={handleReload}
          />
        </View>
      </View>

      {progress > 0 && progress < 1 && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}

      <WebViewWrapper
        ref={webViewRef}
        url={currentUrl}
        isPrivateMode={isPrivateMode}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadProgress={setProgress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
  },
  urlInputContainer: {
    flex: 1,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: 'transparent',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});
