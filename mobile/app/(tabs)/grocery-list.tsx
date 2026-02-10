import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useRecipes, Recipe } from '@/data/recipes-context';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Platform } from 'react-native';

export default function GroceryListScreen() {
  const { recipes, toggleIngredient } = useRecipes();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [isPro, setIsPro] = useState(false);

  // Initialize RevenueCat and check entitlements
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    // Choose test keys for dev/TestFlight
    const apiKey =
      Platform.OS === "ios"
        ? process.env.REVENUECAT_IOS_TEST_KEY || "test_NUIkCnONywjjXanDiPzGTLizYnJ"
        : process.env.REVENUECAT_ANDROID_TEST_KEY || "test_NUIkCnONywjjXanDiPzGTLizYnJ";

    Purchases.configure({ apiKey });

    const updateProStatus = async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        setIsPro(!!info.entitlements.active['Cook Now Pro']);
      } catch (e) {
        console.log('RevenueCat error:', e);
        setIsPro(false);
      }
    };

    updateProStatus();

    // Listen for changes (purchase/restore)
    const listener = Purchases.addCustomerInfoUpdateListener(info => {
      setIsPro(!!info.entitlements.active['Cook Now Pro']);
    });

  }, []);

  // Handle upgrade purchase
  const handleUpgrade = async () => {
    try {
      // Example: purchase monthly product
      await Purchases.purchaseProduct("monthly");
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Purchase failed", e.message);
      }
    }
  };

  // Handle restore purchases
  const handleRestore = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setIsPro(!!info.entitlements.active['Cook Now Pro']);
      Alert.alert("Restored", "Your purchases have been restored.");
    } catch (e: any) {
      Alert.alert("Restore failed", e.message);
    }
  };

  const countMissingIngredients = (recipe: Recipe) => {
    return recipe.ingredients.filter(ing => !ing.hasIt).length;
  };

  const generateShoppingList = () => {
    if (!isPro) {
      Alert.alert(
        'Premium Feature',
        'Upgrade to Cook Now Pro to generate a shopping list!'
      );
      return;
    }

    const missingItems: string[] = [];
    recipes.forEach(recipe =>
      recipe.ingredients.forEach(ing => {
        if (!ing.hasIt) missingItems.push(ing.name);
      })
    );

    if (missingItems.length === 0) {
      Alert.alert('All set!', 'You have all ingredients for your recipes.');
    } else {
      Alert.alert(
        'Shopping List',
        missingItems.map(item => `• ${item}`).join('\n')
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Grocery List</Text>

      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.icon }]}>
            No saved recipes yet.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list}>
            {recipes.map((recipe, index) => {
              if (!isPro && index > 0) return null; // preview only one recipe

              return (
                <View
                  key={recipe.id}
                  style={[
                    styles.recipeCard,
                    { backgroundColor: isPro ? '#f5f5f5' : theme.background },
                  ]}
                >
                  <Text style={[styles.recipeName, { color: theme.text }]}>{recipe.name}</Text>
                  {recipe.ingredients.map(ing => (
                    <TouchableOpacity
                      key={ing.name}
                      style={styles.ingredientRow}
                      onPress={() => toggleIngredient(recipe.id, ing.name)}
                    >
                      <Text style={styles.checkbox}>{ing.hasIt ? '✅' : '⬜'}</Text>
                      <Text style={[styles.ingredientName, { color: theme.text }]}>{ing.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {isPro && countMissingIngredients(recipe) > 0 && (
                    <Text style={styles.missingCount}>
                      Missing: {countMissingIngredients(recipe)}
                    </Text>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Overlay for free users */}
          {!isPro && recipes.length > 0 && (
            <BlurView
              intensity={50}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={styles.blurOverlay}
            >
              <View style={styles.overlayContent}>
                <Text style={[styles.overlayText, { color: theme.text }]}>
                  Upgrade to Cook Now Pro to unlock:
                  {'\n'}• Generate full shopping lists
                  {'\n'}• Count missing ingredients
                  {'\n'}• Advanced recipe filters
                </Text>

                <TouchableOpacity
                  style={[styles.upgradeButton, { backgroundColor: theme.tint }]}
                  onPress={handleUpgrade} // updated
                >
                  <Text style={[styles.upgradeButtonText, { color: '#fff' }]}>
                    Upgrade Now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={handleRestore}
                >
                  <Text style={{ color: theme.tint }}>Restore Purchases</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          )}

          {/* Generate button for Pro users */}
          {isPro && (
            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: theme.tint }]}
              onPress={generateShoppingList}
            >
              <Text style={[styles.generateButtonText, { color: '#fff' }]}>
                Generate Shopping List
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

/* ------ STYLES -----------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
  },
  recipeCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 8,
  },
  ingredientName: {
    fontSize: 16,
  },
  missingCount: {
    marginTop: 8,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#d9534f',
  },
  generateButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.25)',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  overlayContent: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  upgradeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
