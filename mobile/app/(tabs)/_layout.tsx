import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  // Fallback to light mode if system theme is undefined
  const colorScheme = useColorScheme() ?? 'light';

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: Colors[colorScheme].tint,
          tabBarInactiveTintColor: Colors[colorScheme].icon,
        }}>
        
        {/*  Home / My Recipes */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'My Recipes',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />

        {/* Discover / Search */}
        <Tabs.Screen
          name="search"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
          }}
        />

        {/*  Add Recipe */}
        <Tabs.Screen
          name="add-recipe"
          options={{
            title: 'Add Recipe',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
          }}
        />

        {/* Fridge */}
        <Tabs.Screen
          name="fridge"
          options={{
            title: 'Fridge',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="archivebox.fill" color={color} />,
          }}
        />

        {/*  Grocery List */}
        <Tabs.Screen
          name="grocery-list"
          options={{
            title: 'Grocery',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="cart.fill" color={color} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

