import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSettingsStore } from '../store/settingsStore';

interface WebViewWrapperProps {
  url: string;
  isPrivateMode: boolean;
  onNavigationStateChange: (navState: any) => void;
  onLoadProgress?: (progress: number) => void;
}

export const WebViewWrapper = forwardRef<any, WebViewWrapperProps>(
  ({ url, isPrivateMode, onNavigationStateChange, onLoadProgress }, ref) => {
    const { blockTrackers } = useSettingsStore();

    // Basic tracker blocking script (simulated for MVP)
    const injectedJavaScript = `
    // Basic ad/tracker hiding
    const style = document.createElement('style');
    style.innerHTML = \`
      .ad, .advertisement, [id*="ad-"], [class*="ad-"] { display: none !important; }
    \`;
    document.head.appendChild(style);
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
          onLoadProgress={(syntheticEvent: any) =>
            onLoadProgress?.(syntheticEvent.nativeEvent.progress)
          }
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          sharedCookiesEnabled={!isPrivateMode}
          thirdPartyCookiesEnabled={!blockTrackers && !isPrivateMode}
          injectedJavaScript={blockTrackers ? injectedJavaScript : undefined}
        />
      </View>
    );
  },
);

WebViewWrapper.displayName = 'WebViewWrapper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
