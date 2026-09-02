/**
 * Normalizes user input into a valid URL.
 * If it's a search query, it formats it using a default search engine (e.g., DuckDuckGo).
 */
export const normalizeUrl = (input: string): string => {
  const trimmed = input.trim();

  if (!trimmed) {
    return 'https://duckduckgo.com';
  }

  // Check if it's already a valid URL with protocol
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Check if it looks like a domain (e.g., example.com, localhost:3000)
  const isDomainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i;
  const isLocalhost = /^localhost(:\d+)?(\/.*)?$/i;
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/i;

  if (isDomainPattern.test(trimmed) || isLocalhost.test(trimmed) || isIpAddress.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // Otherwise, treat as a search query
  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
};

/**
 * Gets the domain name from a URL for display purposes.
 */
export const getDomainFromUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
