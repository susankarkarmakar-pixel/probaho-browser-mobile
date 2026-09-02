# Probaho Browser Mobile — Design Integration Plan

**Prepared by:** Manus AI  
**Repository:** `susankarkarmakar-pixel/probaho-browser-mobile`  
**Reference:** `stitch_probaho_browser_mobile_app_design.zip`

## 1. Goal

Transform the current Probaho Browser Mobile MVP into the mobile browser experience represented by the supplied design package. The implementation should preserve the repository’s existing Expo/React Native architecture, `react-native-webview` browsing flow, Zustand state stores, React Navigation structure, private-mode handling, and current privacy settings while upgrading the product into a coherent dark-first experience with the supplied home page, browser controls, tab manager, privacy dashboard, settings, library surfaces, and onboarding flow.

The design package should be treated as a **visual and interaction reference**, not as a collection of HTML pages to embed directly. The final implementation should use native React Native components, real navigation, existing state, and real data wherever available. The mobile project currently contains four principal screens—Home, Browser, Tabs, and Settings—plus reusable `URLInput` and `WebViewWrapper` components, a basic Zustand browser store, a settings store, and URL normalization utilities.

## 2. Current repository assessment

| Current area | Existing implementation | Design implication |
|---|---|---|
| Runtime | Expo `~57`, React Native `0.86`, React `19`, TypeScript, React Navigation | Extend the existing native stack; do not introduce a second app framework |
| Navigation | Root stack containing a bottom-tab navigator with Home, Browser, Tabs, and Settings | Keep bottom navigation, but restyle it to match the reference and add nested screens/sheets where needed |
| Browser | `BrowserScreen.tsx` renders `WebViewWrapper` and `URLInput` | Preserve WebView behavior; add a browser chrome layer, privacy sheet trigger, loading/error feedback, and navigation controls |
| Home | `HomeScreen.tsx` currently provides a basic search/home action | Rebuild as the primary Probaho dashboard with greeting, omnibox, quick links, privacy summary, and floating action |
| Tabs | `TabsScreen.tsx` currently supports basic tab listing and selection | Rework into the reference two-column thumbnail/card manager with count badge and Close All behavior |
| Settings | `SettingsScreen.tsx` exposes basic privacy/theme controls | Expand into sectioned grouped settings matching the supplied screen while keeping persisted Zustand settings |
| Browser state | `browserStore.ts` contains tabs, active tab, private mode, add/close/update/select, and a basic clear-private-data action | Add metadata needed for loading, favicon/thumbnail, blocked counts, history, bookmarks, and privacy metrics, with typed actions and safe defaults |
| Settings state | `settingsStore.ts` contains tracker blocking, DoH, and theme | Add ads/cookies/search suggestions/font size/home page and onboarding completion only when corresponding behavior is implemented |
| Theme | `theme.ts` uses a light iOS palette with blue system accent | Replace with centralized Probaho tokens: near-black purple surfaces, lavender primary, cyan secondary, coral danger, muted lavender text |
| Data model | MVP privacy blocking is simulated through injected CSS and WebView cookie flags | Clearly label simulated or unavailable privacy data; do not show hardcoded tracker metrics as real measurements |

## 3. Design language to implement

The supplied screens define a dark, privacy-focused visual system centered on **transparent security** rather than heavy security imagery. The base surface should be a near-black purple, with layered cards in subtly lighter purple tones. Lavender should communicate brand and primary actions, cyan should communicate active, secure, or connected states, and coral should be reserved for destructive actions.

Typography should use Inter if it can be bundled reliably in the Expo project; otherwise use the closest platform-safe fallback with the same hierarchy. The reference uses compact, strong titles, 16px body copy, 14px supporting labels, and 11–12px technical captions. Mobile layout should retain at least 16px screen margins, an 8px spacing rhythm, 12–16px card radii, 24px omnibox radius, tonal borders rather than heavy shadows, and touch targets of at least 44×44 points.

| Token group | Target direction |
|---|---|
| Background | `#15121B` or equivalent deep purple-black |
| Surface layers | `#1D1A24`, `#221E28`, `#2C2833`, `#37333E` |
| Primary | Lavender `#D3BBFF` with deep-purple pressed/filled states |
| Secondary | Cyan `#4CD7F6` for active indicators and secure states |
| Danger | Coral/pink `#FFB4AB` for clear-data actions and warnings |
| Primary text | Light lavender-white `#E8E0EE` |
| Secondary text | `#CCC3D7` and muted lavender-gray |
| Geometry | 8px controls, 12px cards, 16px containers, 24px omnibox/sheets |
| Depth | Tonal layers, 1px low-contrast borders, restrained ambient shadows |

## 4. Screen and feature scope

### Phase A — Foundation and shell

Create a single source of truth for colors, typography, radii, spacing, and elevation in `src/constants/theme.ts`, then update `StyleSheet` definitions to consume those tokens. If the existing project has no font-loading dependency, decide whether to add Expo Font plus an Inter asset or use the platform fallback in the first slice. Update the app-level status bar and navigation colors for the dark-first experience.

Restyle the bottom tab navigator so Home, Browser, Tabs, and Settings use the reference’s dark surface, lavender active state, cyan/neutral inactive icon treatment, and appropriate labels. Make sure safe-area handling is correct for both iOS and Android and that content does not sit underneath the bottom bar.

### Phase B — Home screen

Rebuild `HomeScreen.tsx` to match the supplied home page. The screen should include the Probaho greeting, profile/settings affordance, central shield/privacy tile, large search-or-address omnibox, quick-link grid, privacy summary card, floating add/new-tab action, and bottom navigation integration.

Quick links should be functional rather than decorative. At minimum, Web should focus the omnibox, Add should create a tab, and the remaining links should either navigate to supported library destinations or be represented as configurable shortcuts. The privacy summary must use actual store values; if tracker and time-saved aggregation is not yet available, show a clear unavailable/zero state rather than reference-package numbers.

### Phase C — Browser experience and privacy protection

Upgrade `BrowserScreen.tsx` and `URLInput.tsx` with a mobile browser chrome layer. Preserve the existing URL normalization utility and WebView navigation callbacks. Add back, forward, reload, home, tab count, and menu/privacy actions with accessible labels. The omnibox should show the domain when idle, expose the full URL while editing, keep private mode visibly distinct, and provide loading feedback.

Add a reusable `PrivacyProtectionSheet` opened by the shield/lock action. It should show the current site, privacy status, tracker blocking setting, ad blocking setting if implemented, HTTPS/security status if available, and a detailed report action. Existing `blockTrackers`, `dnsOverHttps`, and `isPrivateMode` values should drive the UI. Any simulated protection must be identified in code and copy so the product does not overstate capabilities.

Add a `PrivacyDashboardScreen` or nested modal screen with a hero metric, four supporting metric cards, tracking activity visualization, top trackers list, export-report action, and clear-data action. Because the current MVP does not expose a real historical tracker dataset, first implement a typed privacy-metrics model with empty/loading states and wire it to real counters as they become available. Do not copy the design’s sample values into production state.

### Phase D — Tab manager

Rebuild `TabsScreen.tsx` as a mobile tab manager with a two-column card grid. Each card should show a safe thumbnail or neutral placeholder, tab title, domain, private-mode marker, selected-tab outline, and close action. The top area should show a grid icon, “Tabs,” the live count, and Done/return behavior. The floating add button should call the existing `addTab` action, while Close All should require confirmation and leave the app with a valid new-tab state.

Extend the tab type only as necessary with fields such as `isPrivate`, `favicon`, `previewUri`, or `lastVisitedAt`. Avoid storing sensitive private-tab previews persistently. If true WebView snapshots are not feasible in the first pass, use a branded placeholder rather than a misleading screenshot.

### Phase E — Settings and library surfaces

Recompose `SettingsScreen.tsx` into grouped sections matching the reference: Privacy & Security, Appearance, Search, Advanced, and About. Existing settings must remain functional. Add only settings whose behavior is implemented or can be safely persisted: block ads, block trackers, block cookies, Secure DNS, clear browsing data, theme, font size, home page, search engine, search suggestions, downloads, notifications, accessibility, version, privacy policy, and rating/about links.

Add mobile-friendly library screens for bookmarks, history, downloads, and reading list. The current repository does not yet show dedicated stores for these collections, so implement them in a follow-up store module with typed schemas and AsyncStorage persistence only if the feature is in scope for the first implementation slice. Otherwise, keep their entry points disabled or clearly marked as upcoming rather than creating non-functional controls.

### Phase F — Onboarding

Add an onboarding stack or modal sequence based on the supplied splash, privacy, speed, and control screens. The flow should explain the product promise, privacy defaults, speed, and user control. It should provide progress indicators, Next/Back/Skip/Finish actions, respect safe areas, and persist completion through AsyncStorage or the existing settings store. Existing users should not be forced through onboarding after upgrade, and the sequence should be replayable from Settings.

## 5. Proposed file structure

| File/module | Responsibility |
|---|---|
| `src/constants/theme.ts` | Central Probaho palette, typography, spacing, radii, shadows, and theme helpers |
| `src/constants/content.ts` | Quick-link definitions, settings section metadata, onboarding copy, and feature flags |
| `src/components/ScreenContainer.tsx` | Safe-area wrapper and shared screen background |
| `src/components/SurfaceCard.tsx` | Tonal card primitive with consistent border/radius/padding |
| `src/components/IconButton.tsx` | 44×44 accessible icon action with pressed feedback |
| `src/components/PrivacyMetricCard.tsx` | Hero and supporting privacy metric cards |
| `src/components/PrivacyProtectionSheet.tsx` | Per-site privacy bottom sheet/modal |
| `src/components/QuickLinkGrid.tsx` | Home shortcut grid |
| `src/components/BottomNav.tsx` | Shared mobile navigation styling if navigator customization is insufficient |
| `src/screens/HomeScreen.tsx` | Reference home dashboard |
| `src/screens/BrowserScreen.tsx` | Browser chrome, WebView, and privacy controls |
| `src/screens/TabsScreen.tsx` | Reference tab grid and tab actions |
| `src/screens/PrivacyDashboardScreen.tsx` | Metrics, activity, tracker list, export/clear actions |
| `src/screens/SettingsScreen.tsx` | Grouped settings cards and secondary screens |
| `src/screens/LibraryScreen.tsx` | Bookmarks/history/downloads/reading list entry points and lists |
| `src/screens/OnboardingScreen.tsx` | First-run sequence |
| `src/store/browserStore.ts` | Tabs, active tab, private mode, browser counters, and tab metadata |
| `src/store/settingsStore.ts` | Privacy, appearance, search, onboarding, and feature settings |
| `src/store/libraryStore.ts` | Typed persisted bookmarks/history/downloads/reading list if implemented |
| `src/utils/privacyMetrics.ts` | Pure aggregation/formatting functions with unit-testable inputs and outputs |
| `src/components/WebViewWrapper.tsx` | WebView privacy configuration and navigation callbacks |

The exact file names may be adjusted to match the repository’s current conventions. The important boundary is that screens should remain relatively small, stores should own state, and reusable visual primitives should prevent style drift between Home, Tabs, Settings, and Privacy Dashboard.

## 6. Data and behavior boundaries

The first implementation should use the existing Zustand stores as the local source of truth. Persistent user preferences should be written through AsyncStorage, with hydration handled before rendering settings-dependent UI. Browser tab operations should remain deterministic when closing the active tab, clearing private data, or entering/exiting private mode.

Privacy UI must distinguish between **implemented**, **simulated**, and **unavailable** capabilities. The current WebView wrapper uses injected CSS and cookie flags for MVP tracker/ad behavior; this should not be represented as a complete network-level blocker. Real tracker counts, time saved, data saved, secure-site rates, and top trackers require a data collection model. Until that model exists, the dashboard should use empty states and explanatory copy rather than hardcoded sample statistics.

## 7. Prioritized delivery sequence

| Priority | Work item | Definition of done |
|---:|---|---|
| P0 | Theme tokens and dark-first shell | All four existing screens compile with the new palette, status bar, safe areas, and accessible touch targets |
| P0 | Home redesign | Home matches the supplied hierarchy and all primary actions connect to existing tab/search/settings behavior |
| P0 | Browser chrome refresh | URL input, navigation actions, private mode treatment, loading state, and privacy entry point work on a real WebView |
| P1 | Privacy sheet | Per-site privacy controls reflect store state and contain no misleading hardcoded security metrics |
| P1 | Tab manager redesign | Two-column responsive card grid supports select, close, add, private markers, and Close All confirmation |
| P1 | Settings redesign | Existing privacy/theme controls remain functional inside the grouped card layout |
| P2 | Privacy dashboard | Metric cards, chart/list containers, empty/loading states, and clear/export flows are connected to available data |
| P2 | Library surfaces | Bookmarks, history, downloads, and reading list are implemented with persistence or explicitly gated as upcoming |
| P2 | Onboarding | First-run screens, persistence, skip/replay behavior, and privacy-default confirmation work end to end |
| P3 | Polish and hardening | Accessibility, press feedback, reduced motion, error states, visual QA, lint, and device-size testing complete |

## 8. Validation plan

Validation should happen on both a narrow portrait viewport and a larger tablet/desktop-sized viewport through Expo web where possible, plus at least one Android or iOS runtime for WebView, safe-area, keyboard, and navigation behavior. The core flows to exercise are: launch and complete onboarding; search or enter a URL; open a new tab; switch and close tabs; enter private mode; open privacy protection; change tracker/DNS settings; open Settings; return to Home; and clear private/browsing data with confirmation.

The repository’s current script provides `npm run lint`. Add unit tests for URL normalization, tab close/active-tab behavior, privacy metric formatting, and persisted settings migration if the project’s test setup is expanded. Use screenshots or a manual visual checklist to compare the implemented Home, Privacy Dashboard, Tabs, Settings, and Onboarding screens against the supplied references without copying sample data into production state.

| Validation area | Required checks |
|---|---|
| Type safety | `npx tsc --noEmit` or the project’s configured TypeScript check passes |
| Lint | `npm run lint` passes with no new warnings |
| Navigation | All tab and nested-screen transitions complete without dead ends |
| WebView | Real URL navigation, editing, reload, private mode, and back/forward behavior remain functional |
| State | Settings and tab mutations persist or update correctly; active-tab closure is safe |
| Accessibility | Labels, focus/press states, readable contrast, and 44-point touch targets are present |
| Responsive UI | No clipping or overlap on small portrait and larger devices; safe areas are respected |
| Privacy honesty | No hardcoded reference-package metrics are presented as real user data |

## 9. Decisions to confirm before implementation

The main scope decision is whether the first coding pass should include the full functional library and historical privacy dashboard or focus on the high-confidence MVP surfaces—Home, Browser, Tabs, Settings, Privacy Sheet, and Onboarding. The current repository has strong foundations for the latter but does not yet expose dedicated bookmark/history/download stores or a real privacy-activity history model.

The plan assumes that the uploaded screens are the target style and interaction reference, while the app remains a native Expo mobile browser. It also assumes that the current simulated tracker/ad behavior will be labeled accurately until a stronger network-level protection layer and metrics pipeline are available.

## Source inputs

This plan is based on the corrected repository’s `README.md`, `package.json`, `App.tsx`, `src/screens/BrowserScreen.tsx`, `src/screens/HomeScreen.tsx`, `src/screens/TabsScreen.tsx`, `src/screens/SettingsScreen.tsx`, `src/components/URLInput.tsx`, `src/components/WebViewWrapper.tsx`, `src/store/browserStore.ts`, `src/store/settingsStore.ts`, and the uploaded design package screens for Home, Browser View, Privacy Dashboard, Tabs, Settings, and onboarding.
