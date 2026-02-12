import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Purchases from 'react-native-purchases';
import { useRouter } from 'expo-router';

import { useRecipes, Recipe } from '@/data/recipes-context';
import { useTheme, ThemeType } from '@/context/ThemeProvider';
import { Fonts } from '@/constants/theme';

export default function GroceryListScreen() {
  const router = useRouter();
  const { recipes, toggleIngredient } = useRecipes();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [isPro, setIsPro] = useState(false);

  // --- RevenueCat: check purchase status & listen for updates ---
  useEffect(() => {
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

    const listener = (info: any) => {
      setIsPro(!!info.entitlements.active['Cook Now Pro']);
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  // --- Handle upgrade purchase ---
  const handleUpgrade = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const proPackage = offerings.current?.availablePackages[0];

      if (!proPackage) {
        alert('Purchase failed: No products available.');
        return;
      }

      await Purchases.purchasePackage(proPackage);
    } catch (e: any) {
      if (!e.userCancelled) alert('Purchase failed: ' + e.message);
    }
  };

  // --- Handle restore purchases ---
  const handleRestore = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setIsPro(!!info.entitlements.active['Cook Now Pro']);
      alert('Your purchases have been restored.');
    } catch (e: any) {
      alert('Restore failed: ' + e.message);
    }
  };

  // --- Count missing ingredients ---
  const countMissingIngredients = (recipe: Recipe) =>
    recipe.ingredients.filter(i => !i.hasIt).length;

  // --- Navigate to Schedule Recipe screen ---
  const handleScheduleRecipe = (recipe: Recipe) => {
    router.push({
      pathname: '/calendar/schedule-recipe',
      params: { id: recipe.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Grocery List</Text>

        {recipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your grocery list is empty.</Text>
            <Text style={styles.emptyText}>Add a recipe to get started!</Text>
          </View>
        ) : (
          recipes.map((recipe, recipeIndex) => {
            if (!isPro && recipeIndex > 0) return null;

            return (
              <View
                key={recipe.id}
                style={[
                  styles.recipeCard,
                  { backgroundColor: theme.card, borderColor: theme.divider },
                ]}
              >
                <Text style={styles.recipeName}>{recipe.name}</Text>

                {recipe.ingredients.map((ing, ingIndex) => (
                  <TouchableOpacity
                    key={`${recipe.id}-${ing.name}-${ingIndex}`}
                    style={styles.ingredientRow}
                    onPress={() => toggleIngredient?.(recipe.id, ing.name)}
                  >
                    <Text style={styles.checkbox}>{ing.hasIt ? '✅' : '⬜'}</Text>
                    <Text style={styles.ingredientName}>{ing.name}</Text>
                  </TouchableOpacity>
                ))}

                {isPro && countMissingIngredients(recipe) > 0 && (
                  <Text style={styles.missingCount}>
                    Missing: {countMissingIngredients(recipe)}
                  </Text>
                )}

                {isPro && (
                  <TouchableOpacity
                    style={[styles.calendarButton, { backgroundColor: theme.accent }]}
                    onPress={() => handleScheduleRecipe(recipe)}
                  >
                    <Text style={[styles.calendarButtonText, { color: theme.buttonText }]}>
                      Schedule Recipe
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

        {/* --- Pro upgrade overlay --- */}
        {!isPro && recipes.length > 1 && (
          <BlurView
            intensity={50}
            tint={Platform.OS === 'ios' ? 'light' : 'light'}
            style={styles.blurOverlay}
          >
            <View style={[styles.overlayContent, { backgroundColor: theme.card }]}>
              <Text
                style={[
                  styles.overlayText,
                  { color: theme.textPrimary, textAlign: 'center' },
                ]}
              >
                Upgrade to Cook Now Pro to unlock:
                {'\n'}• Generate grocery lists
                {'\n'}• See missing ingredients
                {'\n'}• Schedule recipes
              </Text>

              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: theme.accent }]}
                onPress={handleUpgrade}
              >
                <Text style={[styles.upgradeButtonText, { color: theme.buttonText }]}>
                  Upgrade Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginTop: 12, alignSelf: 'center' }} onPress={handleRestore}>
                <Text style={{ color: theme.accent, textAlign: 'center' }}>
                  Restore Purchases
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== Theme-aware styles ===== */
const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 32,
      paddingTop: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 16,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 64,
    },
    emptyText: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    recipeCard: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    recipeName: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 12,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    ingredientRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    checkbox: {
      marginRight: 8,
      fontSize: 16,
    },
    ingredientName: {
      fontSize: 16,
      color: theme.textPrimary,
      fontFamily: Fonts.sans,
    },
    missingCount: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: '600',
      color: theme.accent,
    },
    calendarButton: {
      marginTop: 12,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    calendarButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
    blurOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlayContent: {
      width: '90%',
      borderRadius: 12,
      padding: 16,
    },
    overlayText: {
      fontSize: 16,
      marginBottom: 12,
      fontFamily: Fonts.sans,
    },
    upgradeButton: {
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
    },
    upgradeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: Fonts.sans,
    },
  });

  