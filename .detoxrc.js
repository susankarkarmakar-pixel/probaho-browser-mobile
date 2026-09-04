/** @type {import('detox').DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/config.json',
    },
  },
  artifacts: {
    rootDir: 'artifacts',
    plugins: {
      log: { enabled: true },
      screenshot: { enabled: 'failing' },
      video: { enabled: 'failing' },
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'detox-emulator',
      },
    },
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug --no-daemon',
    },
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
