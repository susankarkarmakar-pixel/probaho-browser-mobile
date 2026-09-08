# Probaho Browser Mobile উন্নয়ন পরিকল্পনা

## সারসংক্ষেপ

বর্তমান Probaho Browser Mobile-এ একটি স্বতন্ত্র dark-first visual system, Home dashboard, Browser surface, Privacy Protection sheet, Privacy Dashboard, Tab Manager, Settings, Library এবং onboarding flow তৈরি হয়েছে। এছাড়া Android APK release workflow, static Mobile CI এবং Detox-ভিত্তিক Android E2E কাঠামো যোগ করা হয়েছে। পরবর্তী উন্নতির মূল লক্ষ্য হওয়া উচিত শুধু UI আরও সুন্দর করা নয়; বরং **বাস্তব privacy protection, সম্পূর্ণ browser capability, নির্ভরযোগ্য data layer, দ্রুত performance এবং release-grade quality** তৈরি করা।

সবচেয়ে গুরুত্বপূর্ণ নীতি হলো: যে privacy metric এখনো সত্যিকারভাবে মাপা যাচ্ছে না, সেটিকে সংখ্যা হিসেবে দেখানো যাবে না। প্রথমে measurement ও enforcement layer তৈরি করতে হবে, তারপর dashboard-এ data দেখাতে হবে।

## বর্তমান অবস্থার মূল্যায়ন

| ক্ষেত্র | বর্তমান অবস্থা | প্রধান ঘাটতি | অগ্রাধিকার |
|---|---|---|---|
| Visual experience | Probaho dark-first mobile design system এবং মূল screenগুলো আছে | Accessibility, interaction polish এবং responsive edge cases আরও যাচাই দরকার | উচ্চ |
| Browser engine | WebView-ভিত্তিক browsing shell, tabs এবং navigation আছে | বাস্তব ad/tracker/cookie blocking, downloads, permissions, file handling এবং error recovery সীমিত | অত্যন্ত উচ্চ |
| Privacy | Privacy settings, protection sheet এবং dashboard UI আছে | UI state-এর সঙ্গে বাস্তব network-level enforcement ও measurable telemetry পুরোপুরি যুক্ত নয় | অত্যন্ত উচ্চ |
| Data persistence | Zustand state ব্যবহৃত হচ্ছে | Bookmarks, history, settings, sessions এবং downloads-এর জন্য durable storage দরকার | অত্যন্ত উচ্চ |
| Reliability | Lint, TypeScript, Expo bundle এবং Mobile CI আছে | Android E2E pipeline-এ Detox native integration স্থায়ীভাবে সম্পন্ন ও সবুজ করা দরকার | অত্যন্ত উচ্চ |
| Release | APK build এবং GitHub Release workflow আছে | Versioning, changelog, signing strategy, rollback এবং staged release দরকার | উচ্চ |

## প্রস্তাবিত অগ্রাধিকার

### Phase 0 — E2E pipeline স্থিতিশীল করা

এটি নতুন feature-এর আগে শেষ করা উচিত, কারণ পরবর্তী browser পরিবর্তন যাচাই করার জন্য নির্ভরযোগ্য test gate প্রয়োজন। Expo prebuild-এর সঙ্গে Detox native integration সম্পূর্ণ করতে হবে, যাতে debug APK এবং `androidTest` APK দুটিই সঠিকভাবে তৈরি হয় এবং emulator-এ test app Detox-এর সঙ্গে যোগাযোগ করতে পারে।

প্রথমে Detox config plugin-টি Expo configuration-এ স্থায়ীভাবে যুক্ত করতে হবে, তারপর generated Android project-এ instrumentation runner, test dependency, network security configuration এবং dummy Detox test runner নিশ্চিত করতে হবে। CI-তে native generation-এর পর Gradle build এবং emulator test চালাতে হবে। Home launch, Browser open, Privacy sheet, Tabs, Settings এবং onboarding replay-এর smoke flow সবুজ না হওয়া পর্যন্ত release workflow-এ E2E gate বাধ্যতামূলক করা উচিত নয়; প্রথমে failure artifact সংগ্রহ ও retry strategy যোগ করে pipeline স্থিতিশীল করতে হবে।

**সফলতার মানদণ্ড:** Android E2E workflow ধারাবাহিকভাবে অন্তত তিনবার pass করবে, failed run-এ logcat, screenshot এবং Detox trace artifact থাকবে, এবং release tag-এ static CI ও E2E উভয় gate pass না করলে APK প্রকাশ হবে না।

### Phase 1 — বাস্তব privacy protection engine

বর্তমান privacy UI-কে সত্যিকার protection layer-এ রূপান্তর করা সবচেয়ে বড় product opportunity। একটি versioned blocklist/allowlist service তৈরি করতে হবে, যাতে tracker domains, known advertising endpoints, cookie-related resources এবং user-defined exceptions পরিচালনা করা যায়। WebView request interception ব্যবহার করে domain-level decision engine তৈরি করা উচিত। প্রতিটি request-এর জন্য allow, block বা upgrade-to-secure সিদ্ধান্ত নেওয়া হবে।

Privacy dashboard-এর counters তখন request decision log থেকে আসবে। Tracker blocked, ads blocked, cookies restricted, HTTPS usage এবং data saved-এর মধ্যে কোনটি সত্যিকারভাবে গণনা করা যাচ্ছে না, সেটি `—` থাকবে। Sensitive browsing history না রেখে aggregate counters, daily buckets এবং local-only statistics রাখা উচিত।

**সফলতার মানদণ্ড:** একটি controlled test page-এ known tracker request block হবে, allowlist exception কাজ করবে, per-site privacy sheet-এ state পরিবর্তন করলে active tab-এ তা প্রয়োগ হবে, এবং dashboard-এর সংখ্যা বাস্তব request log থেকে আসবে।

### Phase 2 — durable data এবং browser fundamentals

Zustand state-কে durable local storage-এর সঙ্গে যুক্ত করতে হবে। Settings, bookmarks, history, reading list, downloads, open tabs এবং onboarding completion encrypted বা platform-secured storage-এ সংরক্ষণ করা উচিত। Data model versioning এবং migration শুরু থেকেই রাখতে হবে, যাতে পরবর্তী release-এ schema পরিবর্তন হলেও user data হারিয়ে না যায়।

তারপর browser fundamentals সম্পূর্ণ করতে হবে: bookmark add/edit/delete, history search এবং clear, download manager, file permission prompts, share action, page find, text selection, long-press handling, open-in-new-tab, private tabs, session restore এবং crash recovery।

**প্রস্তাবিত data entities:** `BrowserTab`, `Bookmark`, `HistoryEntry`, `DownloadItem`, `ReadingListItem`, `PrivacyRule`, `PrivacyAggregate` এবং `AppSetting`। প্রত্যেকটির সঙ্গে schema version, created timestamp এবং updated timestamp রাখা উচিত।

### Phase 3 — privacy-first browsing UX

Privacy শক্তিশালী হলেও ব্যবহারকারীর জন্য বোঝা সহজ না হলে feature-এর মূল্য কমে যায়। Browser toolbar-এ একটি সংক্ষিপ্ত protection status দেখাতে হবে: Secure, Protected, Limited বা Error। Privacy sheet-এ শুধু toggle নয়, বর্তমান site-এ কী block হয়েছে, কোন rule প্রয়োগ হয়েছে এবং user কী পরিবর্তন করতে পারেন তা পরিষ্কারভাবে দেখানো উচিত।

প্রথমবারের user-এর জন্য onboarding-এ privacy claims কেবল তখনই দেখাতে হবে যখন engine সেই claim বাস্তবে পূরণ করছে। Permission request-এর সময় plain-language explanation, site isolation এবং private browsing-এর data lifecycle স্পষ্টভাবে জানাতে হবে।

### Phase 4 — performance, accessibility এবং resilience

WebView-heavy browser-এর জন্য performance budget স্থির করতে হবে। Home screen দ্রুত interactive হওয়া, tab switch দ্রুত হওয়া, large history বা bookmark list scroll smooth থাকা এবং WebView reload-এ অপ্রয়োজনীয় state loss না হওয়া গুরুত্বপূর্ণ। Large lists-এর জন্য virtualization, memoization এবং deferred rendering ব্যবহার করতে হবে।

Accessibility-তে screen-reader label, minimum touch target, contrast, dynamic font size, reduced motion এবং keyboard/switch navigation যাচাই করতে হবে। প্রতিটি actionable control-এর stable accessibility label এবং testID থাকা উচিত।

Resilience layer-এ offline page, network timeout, SSL error, renderer crash, download failure, invalid URL, blocked content এবং low-memory recovery-এর জন্য user-readable state দরকার। Error screen থেকে retry, copy URL এবং return home action দেওয়া উচিত।

### Phase 5 — security এবং privacy governance

Privacy browser হিসেবে threat model লিখে রাখা প্রয়োজন। Threat model-এ network request leakage, local data exposure, clipboard access, screenshots, WebView storage, permission abuse, malicious downloads, intent hijacking এবং third-party script behavior অন্তর্ভুক্ত হবে।

Release-এর আগে dependency audit, Android manifest review, exported component review, cleartext traffic policy, certificate validation এবং WebView security settings automated check-এ রাখতে হবে। Blocklist update গ্রহণের ক্ষেত্রে signed manifest বা integrity check ব্যবহার করা উচিত, যাতে remote configuration compromise হলে browser অন্ধভাবে malicious rule গ্রহণ না করে।

### Phase 6 — release engineering এবং product feedback

APK release-এর জন্য semantic versioning, changelog generation, GitHub Release notes, artifact checksum, signing-key policy এবং rollback documentation তৈরি করতে হবে। Release workflow-এ প্রথমে static checks, তারপর E2E, তারপর signed build এবং শেষে release publication থাকবে। Failed release কখনো public release তৈরি করবে না।

Crash reporting বা privacy-preserving diagnostics যুক্ত করার আগে opt-in, data minimization এবং clear retention policy দরকার। User feedback-এর জন্য in-app report flow থাকতে পারে, তবে browsing URL বা page content default হিসেবে পাঠানো যাবে না।

## প্রস্তাবিত architecture

```text
UI Screens
  ├── Home / Browser / Tabs / Settings / Privacy Dashboard
  └── Shared design primitives and accessibility labels

Navigation and session layer
  ├── Tab lifecycle
  ├── Session restore
  └── Deep-link and external intent handling

Browser domain layer
  ├── URL normalization
  ├── WebView controller
  ├── Request interception
  ├── Download and permission manager
  └── Error and recovery state machine

Privacy domain layer
  ├── Blocklist provider
  ├── Per-site rule evaluator
  ├── HTTPS and cookie policy
  ├── Local aggregate telemetry
  └── Privacy dashboard selectors

Persistence layer
  ├── Versioned local database/storage
  ├── Encrypted sensitive settings
  ├── Migration engine
  └── Export / clear-data operations

Quality and delivery layer
  ├── Lint and TypeScript
  ├── Expo bundle validation
  ├── Detox Android E2E
  ├── APK build
  └── Signed release publication
```

## 90 দিনের delivery roadmap

| সময় | কাজ | প্রত্যাশিত ফলাফল |
|---|---|---|
| সপ্তাহ 1–2 | Detox Expo native integration শেষ করা, smoke flow pass করানো, CI artifact উন্নত করা | Release-এর আগে নির্ভরযোগ্য Android E2E gate |
| সপ্তাহ 3–4 | Local persistence, schema versioning, session restore এবং settings migration | App restart বা update-এ user state নিরাপদ থাকবে |
| সপ্তাহ 5–7 | Request interception, blocklist engine, per-site rules এবং aggregate privacy counters | UI নয়, বাস্তব privacy protection |
| সপ্তাহ 8–9 | Downloads, bookmarks, history, reading list এবং share/find actions | Browser fundamentals সম্পূর্ণ হবে |
| সপ্তাহ 10–11 | Error recovery, performance optimization এবং accessibility audit | Production usability ও reliability উন্নত হবে |
| সপ্তাহ 12 | Security review, signed APK release, changelog, rollback rehearsal | Repeatable production release process |

## Feature prioritization matrix

| Feature | User value | Implementation risk | সিদ্ধান্ত |
|---|---:|---:|---|
| Real tracker/ad blocking | অত্যন্ত উচ্চ | উচ্চ | এখনই শুরু |
| Durable settings and tabs | অত্যন্ত উচ্চ | মাঝারি | এখনই শুরু |
| Detox CI green gate | অত্যন্ত উচ্চ | উচ্চ | release-এর আগে বাধ্যতামূলক |
| Bookmarks/history/downloads | উচ্চ | মাঝারি | Phase 2 |
| Session restore | উচ্চ | মাঝারি | Phase 2 |
| Accessibility audit | উচ্চ | মাঝারি | প্রতিটি phase-এর অংশ |
| Advanced sync/account | মাঝারি | অত্যন্ত উচ্চ | local-first foundation-এর পরে |
| Cloud blocklist updates | মাঝারি | উচ্চ | signed update model-এর পরে |
| Visual customization marketplace | কম | মাঝারি | এখন নয় |

## এখন কোন তিনটি কাজ করা উচিত

প্রথমত, Detox Expo integration ঠিক করে Android E2E workflow সবুজ করতে হবে। দ্বিতীয়ত, WebView request interception ও local privacy decision engine তৈরি করতে হবে, কারণ বর্তমানে privacy dashboard-এর UI আছে কিন্তু সব metric বাস্তব enforcement থেকে আসছে না। তৃতীয়ত, settings, tabs, bookmarks, history এবং privacy aggregates-এর জন্য versioned durable storage তৈরি করতে হবে। এই তিনটি কাজ শেষ হলে পরবর্তী UI feature অনেক কম ঝুঁকিতে যোগ করা যাবে।

## যে বিষয়গুলো এখনই না করাই ভালো

শুরুতেই user account, cloud sync, social features বা remote browsing data collection যোগ করা উচিত নয়। এগুলো privacy promise, legal responsibility এবং operational complexity অনেক বাড়াবে। একইভাবে, বাস্তব measurement ছাড়া dashboard-এ বড় security numbers দেখানো উচিত নয়। প্রথমে trustworthy foundation, তারপর growth features—এই ক্রমটি Probaho-এর জন্য বেশি নিরাপদ।

## Final success definition

Probaho Browser Mobile-এর পরবর্তী major milestone তখনই সফল ধরা হবে যখন একজন নতুন user onboarding শেষ করে একটি page খুলতে পারবেন, browser request policy বাস্তবে কাজ করবে, privacy explanation বুঝতে পারবেন, tab বা setting পরিবর্তন করলে app restart-এর পরেও তা থাকবে, network বা WebView failure থেকে recover করতে পারবেন, এবং একই build Android emulator-এ automated E2E test pass করবে।
