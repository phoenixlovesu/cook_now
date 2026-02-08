import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { MOCK_RECIPES } from '@/data/mock-recipes';

export default function FridgeScreen() {
  const router = useRouter();

  /**
   * TEMP LOGIC (MVP)
   * ----------------
   * For now, this will show a couple of recipes.
   * Later will replace with:
   * - ingredient matching
   * - API-powered recommendations
   */
  const suggestedRecipes = MOCK_RECIPES.slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>
          Recipes you can make
        </Text>

        {/* Empty state */}
        {suggestedRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Add ingredients to your fridge to see recipes.
            </Text>
          </View>
        ) : (
          <FlatList
            data={suggestedRecipes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: '/recipe/[id]',
                    params: {
                      id: item.id,
                    },
                  })
                }
              >
                <Text style={styles.cardTitle}>
                  {item.name}
                </Text>

                <Text style={styles.cardSubtitle}>
                  Tap to view details
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ------ STYLES ---------*/
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 16,
  },

  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});

