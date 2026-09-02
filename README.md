# 📱 Probaho Browser Mobile

The official mobile companion to [Probaho Browser](https://github.com/susankarkarmakar-pixel/probaho-browser). 

Probaho Browser Mobile is a privacy-first, fast, and secure web browser designed specifically for **Android** and **iOS** devices. It brings the core privacy and productivity features of the desktop version to your mobile device, ensuring a seamless and user-controlled browsing experience on the go.

## 🌟 Key Features
- 🔒 **Privacy First:** Built-in tracker and ad blocking (MVP simulated), DNS-over-HTTPS (DoH) support toggle.
- 🕵️ **Private Browsing:** Isolated private mode toggle with distinct UI and session isolation.
- 📑 **Tab Management:** Basic tab manager to open, close, and switch tabs.
- 🏠 **Home Screen:** Clean start page with search input and quick links.
- ⚙️ **Settings:** Toggle privacy options and themes.

## 🛠️ Tech Stack
- **Framework:** React Native with Expo (Managed Workflow)
- **Language:** TypeScript (Strict mode)
- **Navigation:** React Navigation (Native Stack & Bottom Tabs)
- **State Management:** Zustand (lightweight global state for tabs and settings)
- **Core Engine:** `react-native-webview`

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI
- Expo Go app on your physical device (for testing) OR an iOS Simulator / Android Emulator.

### Installation
1. Clone the repository: `git clone https://github.com/susankarkarmakar-pixel/probaho-browser-mobile.git`
2. Navigate to the directory: `cd probaho-browser-mobile`
3. Install dependencies: `npm install`

### Running the App
1. Start the Expo development server:
   ```bash
   npx expo start
   ```
2. **On iOS:**
   - Press `i` in the terminal to open the iOS Simulator (Requires macOS with Xcode installed).
   - Alternatively, scan the QR code with the **Camera app** on your physical iPhone (requires Expo Go).
3. **On Android:**
   - Press `a` in the terminal to open the Android Emulator (Requires Android Studio setup).
   - Alternatively, scan the QR code with the **Expo Go app** on your physical Android device.

## 📁 Architecture
- `/src/components`: Reusable UI elements (URLInput, WebViewWrapper)
- `/src/screens`: Main application screens (Home, Browser, Tabs, Settings)
- `/src/store`: Zustand state management for browser and settings data
- `/src/utils`: Helper functions (URL parsing, etc.)
- `/src/constants`: Theme constants, typography, and colors

## 📄 License
This project is licensed under the [MIT License](LICENSE)
