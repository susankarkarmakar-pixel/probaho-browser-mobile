export type PrivacyDecisionKind = 'tracker' | 'ad' | 'cookie' | 'https' | 'allowed';
export type PrivacyDecisionAction = 'allow' | 'block' | 'upgrade';

export interface PrivacyDecision {
  url: string;
  host: string;
  kind: PrivacyDecisionKind;
  action: PrivacyDecisionAction;
}

const TRACKER_HOST_PATTERNS = [
  /(^|\.)doubleclick\.net$/i,
  /(^|\.)googlesyndication\.com$/i,
  /(^|\.)google-analytics\.com$/i,
  /(^|\.)googletagmanager\.com$/i,
  /(^|\.)facebook\.net$/i,
  /(^|\.)connect\.facebook\.net$/i,
  /(^|\.)segment\.io$/i,
  /(^|\.)mixpanel\.com$/i,
  /(^|\.)hotjar\.com$/i,
  /(^|\.)amplitude\.com$/i,
];

const AD_HOST_PATTERNS = [
  /(^|\.)adnxs\.com$/i,
  /(^|\.)adsrvr\.org$/i,
  /(^|\.)advertising\.com$/i,
  /(^|\.)adservice\.google\.com$/i,
  /(^|\.)outbrain\.com$/i,
  /(^|\.)taboola\.com$/i,
];

const TRACKER_PATH_PATTERNS = [
  /\/pixel(?:\.gif|\.png)?$/i,
  /\/collect(?:\?|\/)/i,
  /\/analytics(?:\?|\/)/i,
];
const AD_PATH_PATTERNS = [
  /\/ads?(?:\?|\/)/i,
  /\/banner(?:s)?(?:\?|\/)/i,
  /\/sponsor(?:ed)?(?:\?|\/)/i,
];

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

export const getUrlHost = (value: string): string => parseUrl(value)?.hostname || 'unknown';

export const upgradeToHttps = (value: string): string => {
  const parsed = parseUrl(value);
  if (!parsed || parsed.protocol !== 'http:' || parsed.hostname === 'localhost') return value;
  parsed.protocol = 'https:';
  return parsed.toString();
};

export const classifyRequest = ({
  url,
  blockTrackers,
  blockAds,
  blockCookies,
  forceHttps,
  isMainFrame = false,
}: {
  url: string;
  blockTrackers: boolean;
  blockAds: boolean;
  blockCookies: boolean;
  forceHttps: boolean;
  isMainFrame?: boolean;
}): PrivacyDecision => {
  const parsed = parseUrl(url);
  const host = parsed?.hostname || 'unknown';
  const pathname = parsed?.pathname || '';

  if (forceHttps && parsed?.protocol === 'http:' && parsed.hostname !== 'localhost') {
    return { url: upgradeToHttps(url), host, kind: 'https', action: 'upgrade' };
  }

  const isTracker =
    TRACKER_HOST_PATTERNS.some((pattern) => pattern.test(host)) ||
    TRACKER_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
  if (blockTrackers && isTracker && !isMainFrame) {
    return { url, host, kind: 'tracker', action: 'block' };
  }

  const isAd =
    AD_HOST_PATTERNS.some((pattern) => pattern.test(host)) ||
    AD_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
  if (blockAds && isAd && !isMainFrame) {
    return { url, host, kind: 'ad', action: 'block' };
  }

  if (blockCookies && parsed?.searchParams.has('cookie')) {
    return { url, host, kind: 'cookie', action: 'block' };
  }

  return { url, host, kind: 'allowed', action: 'allow' };
};
