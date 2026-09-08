import { forwardRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewErrorEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import { classifyRequest, type PrivacyDecision } from '../privacy/privacyEngine';
import { useSettingsStore } from '../store/settingsStore';

type WebViewWrapperProps = {
  url: string;
  isPrivateMode: boolean;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
  onLoadProgress?: (progress: number) => void;
  onPrivacyDecision?: (decision: PrivacyDecision) => void;
  onNavigationRequest?: (url: string) => void;
  onWebViewError?: (message: string) => void;
};

export const WebViewWrapper = forwardRef<any, WebViewWrapperProps>(
  (
    {
      url,
      isPrivateMode,
      onNavigationStateChange,
      onLoadProgress,
      onPrivacyDecision,
      onNavigationRequest,
      onWebViewError,
    },
    ref,
  ) => {
    const { blockTrackers, blockAds, blockCookies, forceHttps } = useSettingsStore();
    const injectedJavaScript = useMemo(() => {
      const rules = [
        blockAds
          ? '.ad, .advertisement, [id*="ad-"], [class*="ad-"] { display: none !important; }'
          : '',
        blockTrackers ? '[data-tracker], [class*="tracking"] { display: none !important; }' : '',
      ]
        .filter(Boolean)
        .join('');
      if (!rules) return undefined;
      return `
        (() => {
          const style = document.createElement('style');
          style.setAttribute('data-probaho-protection', 'true');
          style.textContent = ${JSON.stringify(rules)};
          document.head.appendChild(style);
        })();
        true;
      `;
    }, [blockAds, blockTrackers]);

    const handleRequest = (request: WebViewNavigation) => {
      const requestWithFrame = request as WebViewNavigation & { isTopFrame?: boolean };
      const decision = classifyRequest({
        url: request.url,
        blockTrackers,
        blockAds,
        blockCookies,
        forceHttps,
        isMainFrame: requestWithFrame.isTopFrame !== false,
      });
      onPrivacyDecision?.(decision);
      if (decision.action === 'upgrade') {
        onNavigationRequest?.(decision.url);
        return false;
      }
      return decision.action !== 'block';
    };

    const handleError = (event: WebViewErrorEvent) => {
      onWebViewError?.(event.nativeEvent.description || 'The page could not be loaded.');
    };

    return (
      <View style={styles.container}>
        <WebView
          ref={ref}
          source={{ uri: url }}
          style={styles.webview}
          incognito={isPrivateMode}
          onNavigationStateChange={onNavigationStateChange}
          onShouldStartLoadWithRequest={handleRequest}
          onError={handleError}
          onLoadProgress={(event: any) => onLoadProgress?.(event.nativeEvent.progress)}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction
          sharedCookiesEnabled={!isPrivateMode}
          thirdPartyCookiesEnabled={!blockCookies && !isPrivateMode}
          injectedJavaScript={injectedJavaScript}
          originWhitelist={['http://*', 'https://*', 'about:blank']}
          setSupportMultipleWindows={false}
        />
      </View>
    );
  },
);

WebViewWrapper.displayName = 'WebViewWrapper';

const styles = StyleSheet.create({ container: { flex: 1 }, webview: { flex: 1 } });
