import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSettingsStore } from '../store/settingsStore';

type WebViewWrapperProps = {
  url: string;
  isPrivateMode: boolean;
  onNavigationStateChange: (navState: any) => void;
  onLoadProgress?: (progress: number) => void;
};

export const WebViewWrapper = forwardRef<any, WebViewWrapperProps>(
  ({ url, isPrivateMode, onNavigationStateChange, onLoadProgress }, ref) => {
    const { blockTrackers, blockAds, blockCookies } = useSettingsStore();
    const injectedJavaScript = `
      (() => {
        const style = document.createElement('style');
        style.innerHTML = \
          '${blockAds ? '.ad, .advertisement, [id*="ad-"], [class*="ad-"] { display: none !important; }' : ''}' +
          '${blockTrackers ? '[data-tracker], [class*="tracking"] { display: none !important; }' : ''}';
        document.head.appendChild(style);
      })();
      true;
    `;
    return (
      <View style={styles.container}>
        <WebView
          ref={ref}
          source={{ uri: url }}
          style={styles.webview}
          incognito={isPrivateMode}
          onNavigationStateChange={onNavigationStateChange}
          onLoadProgress={(event: any) => onLoadProgress?.(event.nativeEvent.progress)}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          sharedCookiesEnabled={!isPrivateMode}
          thirdPartyCookiesEnabled={!blockCookies && !isPrivateMode}
          injectedJavaScript={blockTrackers || blockAds ? injectedJavaScript : undefined}
        />
      </View>
    );
  },
);

WebViewWrapper.displayName = 'WebViewWrapper';

const styles = StyleSheet.create({ container: { flex: 1 }, webview: { flex: 1 } });
