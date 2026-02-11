import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
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
      const isProd = !__DEV__;
      const apiKey = isProd
        ? Constants.expoConfig?.extra?.revenuecat?.iosProd
        : Constants.expoConfig?.extra?.revenuecat?.iosTest;

      Purchases.configure({ apiKey });
    }
}, []);


  return (
    <RecipesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </RecipesProvider>
  );
}

