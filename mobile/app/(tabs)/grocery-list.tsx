import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRecipes, Recipe } from '@/data/recipes-context';
import Purchases from 'react-native-purchases';
import { useTheme } from '@/context/ThemeProvider'; // global theme
import { Fonts } from '@/constants/theme';

export default function GroceryListScreen() {
  const { recipes, toggleIngredient } = useRecipes();
  const { theme } = useTheme();

  const [isPro, setIsPro] = useState(false);

  // --- Calendar selection state ---
  const [showPicker, setShowPicker] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  // --- Upgrade / restore purchase handlers ---
  const handleUpgrade = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const proPackage = offerings.current?.availablePackages[0];
      if (!proPackage) {
        Alert.alert('Purchase failed', 'No products available.');
        return;
      }
      await Purchases.purchasePackage(proPackage);
    } catch (e: any) {
      if (!e.userCancelled) Alert.alert('Purchase failed', e.message);
    }
  };

  const handleRestore = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setIsPro(!!info.entitlements.active['Cook Now Pro']);
      Alert.alert('Restored', 'Your purchases have been restored.');
    } catch (e: any) {
      Alert.alert('Restore failed', e.message);
    }
  };

  // --- Count missing ingredients for a recipe ---
  const countMissingIngredients = (recipe: Recipe) =>
    recipe.ingredients.filter(ing => !ing.hasIt).length;

  // --- Open DateTimePicker for calendar event ---
  const handlePickDate = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSelectedDate(new Date());
    setShowPicker(true);
  };

  // --- When user selects a date/time from picker ---
  const onDateChange = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date && selectedRecipe) {
      setSelectedDate(date);
      setShowConfirmModal(true); // open confirmation modal
    }
  };

  // --- Add recipe to native calendar ---
  const addToCalendar = async (recipe: Recipe, date: Date) => {
    if (!isPro) return;

    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Calendar access is needed.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.allowsModifications);

      if (!defaultCalendar) {
        Alert.alert('No editable calendar found');
        return;
      }

      const endDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hr event
      await Calendar.createEventAsync(defaultCalendar.id, {
        title: `Cook: ${recipe.name}`,
        startDate: date,
        endDate,
        notes: recipe.ingredients.map(i => `• ${i.name}`).join('\n'),
        url: `cooknow://recipe/${recipe.id}`, // deep link to recipe
        timeZone: 'UTC',
      });

      Alert.alert('Added to Calendar', `${recipe.name} added to your calendar.`);
    } catch (e) {
      console.log('Calendar error:', e);
      Alert.alert('Failed to add to calendar');
    }
  };

  // --- Confirm adding to calendar ---
  const handleConfirmCalendar = async () => {
    if (selectedRecipe) {
      await addToCalendar(selectedRecipe, selectedDate);
    }
    setShowConfirmModal(false);
    setSelectedRecipe(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Grocery List</Text>

      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No saved recipes yet.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {recipes.map((recipe, index) => {
            if (!isPro && index > 0) return null;

            return (
              <View
                key={recipe.id}
                style={[
                  styles.recipeCard,
                  { backgroundColor: theme.card, borderColor: theme.divider },
                ]}
              >
                <Text style={[styles.recipeName, { color: theme.textPrimary }]}>
                  {recipe.name}
                </Text>

                {recipe.ingredients.map(ing => (
                  <TouchableOpacity
                    key={ing.name}
                    style={styles.ingredientRow}
                    onPress={() => toggleIngredient(recipe.id, ing.name)}
                  >
                    <Text style={styles.checkbox}>{ing.hasIt ? '✅' : '⬜'}</Text>
                    <Text style={[styles.ingredientName, { color: theme.textPrimary }]}>
                      {ing.name}
                    </Text>
                  </TouchableOpacity>
                ))}

                {isPro && countMissingIngredients(recipe) > 0 && (
                  <Text style={[styles.missingCount, { color: theme.textSecondary }]}>
                    Missing: {countMissingIngredients(recipe)}
                  </Text>
                )}

                {/* Pro-only Calendar button */}
                {isPro && (
                  <TouchableOpacity
                    style={[styles.calendarButton, { backgroundColor: theme.accent }]}
                    onPress={() => handlePickDate(recipe)}
                  >
                    <Text style={[styles.calendarButtonText, { color: theme.buttonText }]}>
                      Add to Calendar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          {/* Free users: show paywall overlay */}
          {!isPro && recipes.length > 1 && (
            <BlurView
              intensity={50}
              tint={Platform.OS === 'ios' ? 'light' : 'light'}
              style={styles.blurOverlay}
            >
              <View style={[styles.overlayContent, { backgroundColor: theme.card }]}>
                <Text style={[styles.overlayText, { color: theme.textPrimary }]}>
                  Upgrade to Cook Now Pro to unlock:
                  {'\n'}• Add recipes to your calendar
                </Text>

                <TouchableOpacity
                  style={[styles.upgradeButton, { backgroundColor: theme.accent }]}
                  onPress={handleUpgrade}
                >
                  <Text style={[styles.upgradeButtonText, { color: theme.buttonText }]}>
                    Upgrade Now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 12 }} onPress={handleRestore}>
                  <Text style={{ color: theme.accent }}>Restore Purchases</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          )}

          {/* DateTimePicker modal */}
          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Confirmation modal */}
          <Modal visible={showConfirmModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Confirm Calendar Event
                </Text>
                <Text style={[styles.modalText, { color: theme.textPrimary }]}>
                  Recipe: {selectedRecipe?.name}
                </Text>
                <Text style={[styles.modalText, { color: theme.textPrimary }]}>
                  Date: {selectedDate.toLocaleString()}
                </Text>
                <Text style={[styles.modalText, { color: theme.textPrimary }]}>
                  Ingredients:
                  {'\n'}
                  {selectedRecipe?.ingredients.map(i => `• ${i.name}`).join('\n')}
                </Text>

                <Text style={[styles.modalLink, { color: theme.accent }]}>
                  Link: cooknow://recipe/{selectedRecipe?.id}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: theme.accent }]}
                    onPress={handleConfirmCalendar}
                  >
                    <Text style={[styles.confirmButtonText, { color: theme.buttonText }]}>
                      Add to Calendar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: theme.accent }]}
                    onPress={() => setShowConfirmModal(false)}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.accent }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: Fonts.sans,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: Fonts.sans,
  },

  list: {
    paddingBottom: 200,
  },

  recipeCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },

  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: Fonts.sans,
  },

  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  checkbox: {
    marginRight: 8,
    fontSize: 16,
  },

  ingredientName: {
    fontSize: 16,
    fontFamily: Fonts.sans,
  },

  missingCount: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.sans,
  },

  calendarButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },

  calendarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },

  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  overlayContent: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '90%',
  },

  overlayText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Fonts.sans,
  },

  upgradeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },

  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    fontFamily: Fonts.sans,
  },

  modalText: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Fonts.sans,
  },

  modalLink: {
    fontSize: 14,
    marginBottom: 16,
    fontFamily: Fonts.sans,
    textDecorationLine: 'underline',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },

  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginLeft: 8,
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },

});
