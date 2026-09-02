import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from './src/screens/HomeScreen';
import { BrowserScreen } from './src/screens/BrowserScreen';
import { TabsScreen } from './src/screens/TabsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { COLORS } from './src/constants/theme';
import { useBrowserStore } from './src/store/browserStore';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => {
  const { isPrivateMode, tabs } = useBrowserStore();

  const tabBarColor = isPrivateMode ? COLORS.privateBackground : COLORS.background.light;
  const activeColor = isPrivateMode ? COLORS.privateText : COLORS.primary;
  const inactiveColor = COLORS.inactiveText;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'home';

          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Browser') iconName = focused ? 'globe' : 'globe-outline';
          else if (route.name === 'Tabs') iconName = focused ? 'copy' : 'copy-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarColor,
          borderTopColor: isPrivateMode ? COLORS.darkBorder : COLORS.border,
        },
        tabBarBadge: route.name === 'Tabs' && tabs.length > 0 ? tabs.length : undefined,
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Root" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
