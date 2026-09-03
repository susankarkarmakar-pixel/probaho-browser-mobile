import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from './src/screens/HomeScreen';
import { BrowserScreen } from './src/screens/BrowserScreen';
import { TabsScreen } from './src/screens/TabsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BookmarksScreen } from './src/screens/BookmarksScreen';
import { COLORS } from './src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomTabNavigationProp, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { TouchableOpacity, View, StyleSheet } from 'react-native';

export type RootStackParamList = {
  Root: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Browser: undefined;
  Tabs: undefined;
  Settings: undefined;
  Bookmarks: undefined;
};

export type AppNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Tab = createBottomTabNavigator<MainTabsParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  // Navigation layout based on image:
  // Back, Forward, Home, Tabs/Menu

  const handleNavigate = (routeName: string) => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => {
          /* Handle Back in Browser */
        }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => {
          /* Handle Forward in Browser */
        }}
      >
        <Ionicons name="arrow-forward" size={24} color={COLORS.text.secondary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Home')}>
        <Ionicons
          name={state.routes[state.index].name === 'Home' ? 'home' : 'home-outline'}
          size={24}
          color={state.routes[state.index].name === 'Home' ? COLORS.primary : COLORS.text.secondary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Tabs')}>
        <Ionicons
          name={state.routes[state.index].name === 'Tabs' ? 'browsers' : 'browsers-outline'}
          size={24}
          color={state.routes[state.index].name === 'Tabs' ? COLORS.primary : COLORS.text.secondary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => handleNavigate('Settings')}>
        <View
          style={[
            styles.menuButton,
            state.routes[state.index].name === 'Settings' && styles.menuButtonActive,
          ]}
        >
          <Ionicons
            name="menu"
            size={24}
            color={
              state.routes[state.index].name === 'Settings' ? COLORS.primary : COLORS.text.primary
            }
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browser" component={BrowserScreen} />
      <Tab.Screen name="Tabs" component={TabsScreen} />
      <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#433C4F', // Dark purple background from image
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primary, // Using primary lavender color from image
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonActive: {
    backgroundColor: '#3E2421', // Darker to show active state
  },
});

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: COLORS.background.main }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background.main },
          }}
        >
          <Stack.Screen name="Root" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
