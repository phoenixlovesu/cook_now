import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';

import { ThemeProvider as AppThemeProvider } from '@/context/ThemeProvider';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { RecipesProvider } from '@/data/recipes-context';
import Purchases, { LOG_LEVEL } from "react-native-purchases";// import Purchases
import { useEffect } from 'react';
import { Platform } from "react-native";
import Constants from "expo-constants";



export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Initialize RevenueCat when app loads
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      // Determine if this is a production build
      const isProd = !__DEV__; // __DEV__ is true for local/dev/TestFlight, false for App Store release

      const apiKey = isProd
        ? Constants.expoConfig?.extra?.revenuecat?.iosProd // Production key for App Store release
        : Constants.expoConfig?.extra?.revenuecat?.iosTest; // Test key for dev/TestFlight

      Purchases.configure({ apiKey });
    }
  }, []);


return (
  <RecipesProvider>
    <AppThemeProvider>
      <NavigationThemeProvider
        value={colorScheme === 'dark'
          ? NavigationDarkTheme
          : NavigationDefaultTheme}
      >
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>

        <StatusBar style="auto" />
      </NavigationThemeProvider>
    </AppThemeProvider>
  </RecipesProvider>
);

}
