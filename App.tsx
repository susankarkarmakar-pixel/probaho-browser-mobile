import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from './src/constants/theme';
import { useBrowserStore } from './src/store/browserStore';
import { HomeScreen } from './src/screens/HomeScreen';
import { BrowserScreen } from './src/screens/BrowserScreen';
import { TabsScreen } from './src/screens/TabsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PrivacyDashboardScreen } from './src/screens/PrivacyDashboardScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  const { tabs } = useBrowserStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSubtle,
        tabBarButtonTestID: `${route.name.toLowerCase()}-tab`,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: 2 },
        tabBarStyle: {
          backgroundColor: COLORS.surfaceMuted,
          borderTopColor: COLORS.borderSoft,
          height: 64,
          paddingTop: 7,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [any, any]> = {
            Home: ['home', 'home-outline'],
            Browser: ['globe', 'globe-outline'],
            Tabs: ['copy', 'copy-outline'],
            Settings: ['settings', 'settings-outline'],
          };
          const pair = icons[route.name] || icons.Home;
          return <Ionicons name={focused ? pair[0] : pair[1]} size={size} color={color} />;
        },
        tabBarBadge: route.name === 'Tabs' && tabs.length > 1 ? tabs.length : undefined,
        tabBarBadgeStyle: {
          backgroundColor: COLORS.secondary,
          color: COLORS.surfaceMuted,
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browser" component={BrowserScreen} />
      <Tab.Screen name="Tabs" component={TabsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          ...DarkTheme,
          dark: true,
          colors: {
            ...DarkTheme.colors,
            primary: COLORS.primary,
            background: COLORS.background,
            card: COLORS.surfaceMuted,
            text: COLORS.text,
            border: COLORS.borderSoft,
            notification: COLORS.secondary,
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="Root" component={MainTabs} />
          <Stack.Screen name="PrivacyDashboard" component={PrivacyDashboardScreen} />
          <Stack.Screen name="Library" component={LibraryScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
